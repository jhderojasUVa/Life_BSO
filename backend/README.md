# Backend

The backend is a Python application built with the **FastAPI** framework. It uses a pre-trained **TensorFlow** model (MobileNetV2) to perform image recognition.

## Logging

The backend uses a custom logger to print color-coded messages to the console. The logger is defined in `backend/logger.py` and is used in `backend/main.py` to log requests and other important events.

## Music Files

The backend uses placeholder music files. To use your own music, replace the files in the `backend/music` directory with your own `.mid` files. The current placeholder files are:

- `coffee_shop.mid`
- `lofi_beats.mid`
- `electronic_music.mid`
- `default_music.mid`

You can also update the `MUSIC_MAPPING` dictionary in `backend/main.py` to map different objects to different music files.
