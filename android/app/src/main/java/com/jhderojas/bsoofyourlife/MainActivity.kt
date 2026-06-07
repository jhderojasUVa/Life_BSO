package com.jhderojas.bsoofyourlife

import android.Manifest
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.jhderojas.bsoofyourlife.databinding.ActivityMainBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import java.io.File
import java.text.SimpleDateFormat
import java.util.Locale
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

class MainActivity : AppCompatActivity() {

    companion object {
        private const val MAX_PREDICTION_ATTEMPTS = 3
        private const val CROSSFADE_DURATION_MS = 1200L
        private const val AUTO_RESUME_DELAY_MS = 1200L
        private const val AUTO_RESUME_POLL_MS = 300L
        private const val AUTO_RESUME_MAX_POLLS = 10
        private const val PREFS_NAME = "bso_preferences"
        private const val PREF_USE_LOCAL_INFERENCE = "pref_use_local_inference"
        private const val PREF_CAMERA_POSITION = "pref_camera_position"
        private const val PREF_INTERVAL_SECONDS = "pref_interval_seconds"
        private const val PREF_CAPTURE_RUNNING = "pref_capture_running"
    }

    private lateinit var binding: ActivityMainBinding
    private var imageCapture: ImageCapture? = null
    private var selectedLensFacing: Int = CameraSelector.LENS_FACING_BACK
    private var captureLoopJob: Job? = null
    private var useLocalInference: Boolean = BuildConfig.USE_LOCAL_INFERENCE
    private val prefs by lazy { getSharedPreferences(PREFS_NAME, MODE_PRIVATE) }

    private lateinit var inferenceClient: InferenceClient
    private var localPredictor: LocalOnDevicePredictor? = null
    private var playerA: MediaPlayer? = null
    private var playerB: MediaPlayer? = null
    private var activePlayer: MediaPlayer? = null
    private var activeMusicUrl: String? = null
    private var fadeJob: Job? = null

    private val requestPermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            if (granted) {
                startCamera(selectedLensFacing)
                maybeAutoResumeCaptureLoop()
            } else {
                Toast.makeText(this, "Camera permission is required", Toast.LENGTH_LONG).show()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        useLocalInference = prefs.getBoolean(PREF_USE_LOCAL_INFERENCE, BuildConfig.USE_LOCAL_INFERENCE)

        inferenceClient = InferenceClient(baseUrl = BuildConfig.BACKEND_BASE_URL)
        if (useLocalInference) {
            localPredictor = LocalOnDevicePredictor(this)
        }
        playerA = MediaPlayer().apply { isLooping = true }
        playerB = MediaPlayer().apply { isLooping = true }

        setupModeSwitch()
        setupCameraSelector()
        setupIntervalSlider()
        setupButtons()

        ensureCameraPermissionAndStart()
    }

    private fun setupCameraSelector() {
        val adapter = ArrayAdapter.createFromResource(
            this,
            R.array.camera_options,
            android.R.layout.simple_spinner_item
        )
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.cameraSpinner.adapter = adapter

        val savedCameraPosition = prefs.getInt(PREF_CAMERA_POSITION, 0).coerceIn(0, 1)
        binding.cameraSpinner.setSelection(savedCameraPosition)
        binding.cameraSpinner.setOnItemSelectedListener(
            object : android.widget.AdapterView.OnItemSelectedListener {
                override fun onItemSelected(
                    parent: android.widget.AdapterView<*>?,
                    view: android.view.View?,
                    position: Int,
                    id: Long
                ) {
                    prefs.edit().putInt(PREF_CAMERA_POSITION, position).apply()
                    selectedLensFacing = if (position == 0) {
                        CameraSelector.LENS_FACING_BACK
                    } else {
                        CameraSelector.LENS_FACING_FRONT
                    }
                    startCamera(selectedLensFacing)
                }

                override fun onNothingSelected(parent: android.widget.AdapterView<*>?) = Unit
            }
        )
    }

    private fun setupIntervalSlider() {
        val savedInterval = prefs.getInt(PREF_INTERVAL_SECONDS, 3).coerceIn(3, 10)
        binding.intervalSlider.value = savedInterval.toFloat()
        binding.intervalLabel.text = "Interval: ${savedInterval} seconds"

        binding.intervalSlider.addOnChangeListener { _, value, _ ->
            val intervalSeconds = value.toInt()
            prefs.edit().putInt(PREF_INTERVAL_SECONDS, intervalSeconds).apply()
            binding.intervalLabel.text = "Interval: ${intervalSeconds} seconds"
        }
    }

    private fun setupButtons() {
        binding.startButton.setOnClickListener { startCaptureLoop() }
        binding.stopButton.setOnClickListener { stopCaptureLoop() }
    }

    private fun setupModeSwitch() {
        binding.modeSwitch.isChecked = !useLocalInference
        updateModeLabel()

        binding.modeSwitch.setOnCheckedChangeListener { _, isChecked ->
            useLocalInference = !isChecked
            prefs.edit().putBoolean(PREF_USE_LOCAL_INFERENCE, useLocalInference).apply()
            if (captureLoopJob?.isActive == true) {
                stopCaptureLoop()
            }

            if (useLocalInference) {
                if (localPredictor == null) {
                    localPredictor = LocalOnDevicePredictor(this)
                }
                binding.statusText.text = "Status: local mode enabled"
            } else {
                localPredictor?.close()
                localPredictor = null
                binding.statusText.text = "Status: backend mode enabled"
            }
            updateModeLabel()
        }
    }

    private fun updateModeLabel() {
        binding.modeValueText.text = if (useLocalInference) "Local" else "Backend"
    }

    private fun ensureCameraPermissionAndStart() {
        val granted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED

        if (granted) {
            startCamera(selectedLensFacing)
            maybeAutoResumeCaptureLoop()
        } else {
            requestPermission.launch(Manifest.permission.CAMERA)
        }
    }

    private fun startCamera(lensFacing: Int) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener(
            {
                val cameraProvider = cameraProviderFuture.get()
                val preview = androidx.camera.core.Preview.Builder().build().also {
                    it.setSurfaceProvider(binding.previewView.surfaceProvider)
                }

                imageCapture = ImageCapture.Builder().build()
                val cameraSelector = CameraSelector.Builder()
                    .requireLensFacing(lensFacing)
                    .build()

                try {
                    cameraProvider.unbindAll()
                    cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageCapture)
                    binding.statusText.text = "Status: camera ready"
                } catch (exc: Exception) {
                    binding.statusText.text = "Status: camera error"
                    Toast.makeText(this, "Camera bind failed: ${exc.message}", Toast.LENGTH_LONG).show()
                }
            },
            ContextCompat.getMainExecutor(this)
        )
    }

    private fun startCaptureLoop() {
        if (captureLoopJob?.isActive == true) return
        prefs.edit().putBoolean(PREF_CAPTURE_RUNNING, true).apply()

        binding.startButton.isEnabled = false
        binding.stopButton.isEnabled = true
        binding.statusText.text = "Status: running"

        val intervalSeconds = binding.intervalSlider.value.toLong()
        captureLoopJob = lifecycleScope.launch {
            while (true) {
                var photoFile: File? = null
                try {
                    photoFile = capturePhotoToTempFile()
                    val prediction = predictWithRetry(photoFile)

                    binding.predictionText.text = "Last object: ${prediction.label}"
                    binding.statusText.text = "Status: detected ${prediction.label}"
                    playMusic(prediction.musicUrl)
                } catch (error: Exception) {
                    binding.statusText.text = "Status: error ${error.message}"
                } finally {
                    photoFile?.delete()
                }

                delay(intervalSeconds * 1000L)
            }
        }
    }

    private fun stopCaptureLoop(updatePreference: Boolean = true) {
        if (updatePreference) {
            prefs.edit().putBoolean(PREF_CAPTURE_RUNNING, false).apply()
        }
        captureLoopJob?.cancel()
        captureLoopJob = null
        binding.startButton.isEnabled = true
        binding.stopButton.isEnabled = false
        binding.statusText.text = "Status: stopped"
    }

    private fun maybeAutoResumeCaptureLoop() {
        val shouldAutoResume = prefs.getBoolean(PREF_CAPTURE_RUNNING, false)
        if (!shouldAutoResume) {
            return
        }

        lifecycleScope.launch {
            delay(AUTO_RESUME_DELAY_MS)
            repeat(AUTO_RESUME_MAX_POLLS) {
                if (imageCapture != null) {
                    if (captureLoopJob?.isActive != true) {
                        binding.statusText.text = "Status: auto-resuming"
                        startCaptureLoop()
                    }
                    return@launch
                }
                delay(AUTO_RESUME_POLL_MS)
            }
            binding.statusText.text = "Status: auto-resume skipped (camera not ready)"
        }
    }

    private suspend fun capturePhotoToTempFile(): File = suspendCancellableCoroutine { cont ->
        val capture = imageCapture
        if (capture == null) {
            cont.resumeWithException(IllegalStateException("ImageCapture not initialized"))
            return@suspendCancellableCoroutine
        }

        val timestamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(System.currentTimeMillis())
        val file = File(cacheDir, "capture_$timestamp.jpg")
        val options = ImageCapture.OutputFileOptions.Builder(file).build()

        capture.takePicture(
            options,
            ContextCompat.getMainExecutor(this),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                    cont.resume(file)
                }

                override fun onError(exception: ImageCaptureException) {
                    cont.resumeWithException(exception)
                }
            }
        )
    }

    private fun playMusic(musicUrl: String?) {
        if (musicUrl.isNullOrBlank()) {
            return
        }

        if (activeMusicUrl == musicUrl) {
            return
        }

        val current = activePlayer
        val next = when (current) {
            playerA -> playerB
            playerB -> playerA
            else -> playerA
        } ?: return

        try {
            next.reset()
            next.isLooping = true
            next.setVolume(0f, 0f)
            next.setDataSource(this, Uri.parse(musicUrl))
            next.setOnPreparedListener {
                it.start()
                crossfadePlayers(from = current, to = it)
                activePlayer = it
                activeMusicUrl = musicUrl
            }
            next.prepareAsync()
        } catch (error: Exception) {
            binding.statusText.text = "Status: audio error ${error.message}"
        }
    }

    private suspend fun predictWithRetry(photoFile: File): InferenceClient.PredictionResult {
        if (useLocalInference) {
            val predictor = localPredictor ?: throw IllegalStateException("Local predictor not initialized")
            return withContext(Dispatchers.IO) {
                predictor.predict(photoFile)
            }
        }

        var lastError: Exception? = null
        for (attempt in 1..MAX_PREDICTION_ATTEMPTS) {
            try {
                return withContext(Dispatchers.IO) {
                    inferenceClient.predict(photoFile)
                }
            } catch (error: Exception) {
                lastError = error
                if (attempt < MAX_PREDICTION_ATTEMPTS) {
                    binding.statusText.text = "Status: retry $attempt/$MAX_PREDICTION_ATTEMPTS"
                    delay(CaptureRetryPolicy.backoffDelayMs(attempt))
                }
            }
        }

        throw IllegalStateException(
            "Prediction failed after $MAX_PREDICTION_ATTEMPTS attempts",
            lastError
        )
    }

    private fun crossfadePlayers(from: MediaPlayer?, to: MediaPlayer) {
        fadeJob?.cancel()
        if (from == null) {
            to.setVolume(1f, 1f)
            return
        }

        fadeJob = lifecycleScope.launch {
            val stepDelayMs = 120L
            val steps = (CROSSFADE_DURATION_MS / stepDelayMs).toInt().coerceAtLeast(1)

            for (step in 1..steps) {
                val progress = step.toFloat() / steps.toFloat()
                val fadeIn = progress.coerceIn(0f, 1f)
                val fadeOut = (1f - progress).coerceIn(0f, 1f)
                to.setVolume(fadeIn, fadeIn)
                from.setVolume(fadeOut, fadeOut)
                delay(stepDelayMs)
            }

            from.pause()
            from.seekTo(0)
            from.setVolume(1f, 1f)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        stopCaptureLoop(updatePreference = false)
        fadeJob?.cancel()

        playerA?.stop()
        playerA?.release()
        playerA = null

        playerB?.stop()
        playerB?.release()
        playerB = null

        activePlayer = null
        activeMusicUrl = null
        localPredictor?.close()
        localPredictor = null
    }
}
