package com.jhderojas.bsoofyourlife

enum class MusicTrack(val rawName: String) {
    COFFEE_SHOP("coffee_shop"),
    LOFI_BEATS("lofi_beats"),
    ELECTRONIC_MUSIC("electronic_music"),
    DEFAULT_MUSIC("default_music")
}

object ObjectMusicMapper {
    fun trackForLabel(label: String): MusicTrack {
        val lower = label.lowercase()
        return when {
            "coffee" in lower || "mug" in lower || "cup" in lower -> MusicTrack.COFFEE_SHOP
            "keyboard" in lower || "computer" in lower || "laptop" in lower -> MusicTrack.LOFI_BEATS
            "mouse" in lower || "device" in lower -> MusicTrack.ELECTRONIC_MUSIC
            else -> MusicTrack.DEFAULT_MUSIC
        }
    }
}
