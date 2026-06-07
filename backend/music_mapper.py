MUSIC_MAPPING = {
    "coffee_mug": "coffee_shop.mid",
    "keyboard": "lofi_beats.mid",
    "mouse": "electronic_music.mid",
}
DEFAULT_MUSIC = "default_music.mid"


def map_object_to_music(object_name: str) -> str:
    return MUSIC_MAPPING.get(object_name, DEFAULT_MUSIC)
