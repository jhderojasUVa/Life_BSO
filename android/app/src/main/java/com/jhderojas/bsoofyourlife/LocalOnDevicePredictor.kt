package com.jhderojas.bsoofyourlife

import android.content.Context
import android.graphics.BitmapFactory
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.label.ImageLabeling
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions
import kotlinx.coroutines.tasks.await
import java.io.File

class LocalOnDevicePredictor(private val context: Context) {

    private val labeler = ImageLabeling.getClient(
        ImageLabelerOptions.Builder()
            .setConfidenceThreshold(0.55f)
            .build()
    )

    suspend fun predict(imageFile: File): InferenceClient.PredictionResult {
        val bitmap = BitmapFactory.decodeFile(imageFile.absolutePath)
            ?: throw IllegalStateException("Could not decode image")
        val image = InputImage.fromBitmap(bitmap, 0)
        val labels = labeler.process(image).await()

        val topLabel = labels.maxByOrNull { it.confidence }?.text ?: "unknown"
        val track = ObjectMusicMapper.trackForLabel(topLabel)
        val resourceUri = rawResourceUri(track.rawName)

        return InferenceClient.PredictionResult(
            label = topLabel,
            musicUrl = resourceUri
        )
    }

    private fun rawResourceUri(rawName: String): String {
        val rawId = context.resources.getIdentifier(rawName, "raw", context.packageName)
        if (rawId == 0) {
            throw IllegalStateException("Missing raw resource: $rawName")
        }
        return "android.resource://${context.packageName}/$rawId"
    }

    fun close() {
        labeler.close()
    }
}
