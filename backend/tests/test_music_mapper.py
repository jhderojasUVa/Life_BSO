from music_mapper import DEFAULT_MUSIC, map_object_to_music


def test_map_object_to_music_returns_mapped_track() -> None:
    assert map_object_to_music("keyboard") == "lofi_beats.mid"


def test_map_object_to_music_returns_default_for_unknown_object() -> None:
    assert map_object_to_music("tree") == DEFAULT_MUSIC
