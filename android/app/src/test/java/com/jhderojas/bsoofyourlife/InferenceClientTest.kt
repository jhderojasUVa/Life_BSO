package com.jhderojas.bsoofyourlife

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class InferenceClientTest {

    private val client = InferenceClient("http://localhost:8000/")

    @Test
    fun parsePrediction_buildsMusicUrlFromMusicFile() {
        val body = """{"object":"keyboard","music_file":"lofi_beats.mid"}"""

        val result = client.parsePrediction(body)

        assertEquals("keyboard", result.label)
        assertEquals("http://localhost:8000/music/lofi_beats.mid", result.musicUrl)
    }

    @Test
    fun parsePrediction_supportsFallbackKeys() {
        val body = """{"prediction":"coffee_mug","song_url":"https://cdn.example/song.mp3"}"""

        val result = client.parsePrediction(body)

        assertEquals("coffee_mug", result.label)
        assertEquals("https://cdn.example/song.mp3", result.musicUrl)
    }

    @Test
    fun parsePrediction_defaultsWhenFieldsMissing() {
        val body = "{}"

        val result = client.parsePrediction(body)

        assertEquals("unknown", result.label)
        assertNull(result.musicUrl)
    }

    @Test
    fun normalizeBaseUrl_trimsTrailingSlash() {
        val result = client.normalizeBaseUrl("http://localhost:8000/")

        assertEquals("http://localhost:8000", result)
    }
}
