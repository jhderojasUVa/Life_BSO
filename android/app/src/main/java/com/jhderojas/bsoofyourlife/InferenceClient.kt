package com.jhderojas.bsoofyourlife

import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONObject
import java.io.File

class InferenceClient(
    private val baseUrl: String,
    private val client: OkHttpClient = OkHttpClient()
) {

    data class PredictionResult(
        val label: String,
        val musicUrl: String?
    )

    internal fun normalizeBaseUrl(url: String): String = url.trimEnd('/')

    fun predict(imageFile: File): PredictionResult {
        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart(
                "file",
                imageFile.name,
                imageFile.asRequestBody("image/jpeg".toMediaType())
            )
            .build()

        val request = Request.Builder()
            .url("${normalizeBaseUrl(baseUrl)}/predict")
            .post(requestBody)
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw IllegalStateException("Backend error: ${response.code}")
            }

            val body = response.body?.string().orEmpty()
            return parsePrediction(body)
        }
    }

    internal fun parsePrediction(body: String): PredictionResult {
        val json = JSONObject(body)

        val label = when {
            json.has("object") -> json.optString("object")
            json.has("label") -> json.optString("label")
            json.has("prediction") -> json.optString("prediction")
            else -> "unknown"
        }

        val musicUrl = when {
            json.has("music_file") -> {
                val musicFile = json.optString("music_file").ifBlank { null }
                musicFile?.let { buildMusicUrlFromFile(it) }
            }
            json.has("music_url") -> json.optString("music_url").ifBlank { null }
            json.has("song_url") -> json.optString("song_url").ifBlank { null }
            else -> null
        }

        return PredictionResult(label = label.ifBlank { "unknown" }, musicUrl = musicUrl)
    }

    internal fun buildMusicUrlFromFile(fileName: String): String {
        return "${normalizeBaseUrl(baseUrl)}/music/$fileName"
    }
}
