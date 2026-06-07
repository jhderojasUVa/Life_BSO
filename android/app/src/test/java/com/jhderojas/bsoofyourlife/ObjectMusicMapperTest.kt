package com.jhderojas.bsoofyourlife

import org.junit.Assert.assertEquals
import org.junit.Test

class ObjectMusicMapperTest {

    @Test
    fun trackForLabel_mapsCoffeeLabels() {
        assertEquals(MusicTrack.COFFEE_SHOP, ObjectMusicMapper.trackForLabel("coffee mug"))
    }

    @Test
    fun trackForLabel_mapsKeyboardLabels() {
        assertEquals(MusicTrack.LOFI_BEATS, ObjectMusicMapper.trackForLabel("computer keyboard"))
    }

    @Test
    fun trackForLabel_mapsMouseLabels() {
        assertEquals(MusicTrack.ELECTRONIC_MUSIC, ObjectMusicMapper.trackForLabel("wireless mouse"))
    }

    @Test
    fun trackForLabel_defaultsWhenNoMatch() {
        assertEquals(MusicTrack.DEFAULT_MUSIC, ObjectMusicMapper.trackForLabel("tree"))
    }
}
