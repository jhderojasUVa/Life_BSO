# BSO of your life

This project is a web application that uses your camera to recognize objects and plays different music based on the recognized object.

## Project Structure

- `frontend/`: Contains the React frontend application.
- `backend/`: Contains the FastAPI backend application.

## Development

This project is set up as a monorepo with a frontend and a backend. You can run the application using Docker or manually using the root `Makefile`.

### Using Docker

To run the application using Docker, you will need to have Docker and Docker Compose installed.

- `make docker-up`: Build and run the containers.
- `make docker-down`: Stop and remove the containers.

### Running Manually

- `make install`: Install the dependencies for both the frontend and the backend.
- `make run`: Run both the frontend and the backend development servers.
- `make lint`: Lint both the frontend and the backend.
- `make clean`: Clean the backend build artifacts.

## Music Files

The backend uses placeholder music files. To use your own music, replace the files in the `backend/music` directory with your own `.mid` files. The current placeholder files are:

- `coffee_shop.mid`
- `lofi_beats.mid`
- `electronic_music.mid`
- `default_music.mid`

You can also update the `MUSIC_MAPPING` dictionary in `backend/main.py` to map different objects to different music files.
