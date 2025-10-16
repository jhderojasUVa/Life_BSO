# BSO of your life

This project is a web application that uses your camera to recognize objects and plays different music based on the recognized object.

## Project Structure

- `frontend/`: Contains the React frontend application.
- `backend/`: Contains the FastAPI backend application.

## Running with Docker

To run the application using Docker, you will need to have Docker and Docker Compose installed.

1.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```

2.  **Access the application:**
    - The frontend will be available at `http://localhost:5173`.

## How to Run the Application Manually

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install the dependencies:**
    ```bash
    make install
    ```

3.  **Run the backend server:**
    ```bash
    make run
    ```
    The backend will be running at `http://localhost:8000`.

### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/web
    ```

2.  **Install the dependencies:**
    ```bash
    make install
    ```

3.  **Run the frontend development server:**
    ```bash
    make dev
    ```
    The frontend will be running at `http://localhost:5173`.

## Development

The `Makefile` in the `backend` directory provides several commands to help with development:

- `make install`: Install the project dependencies using Poetry.
- `make run`: Start the development server.
- `make lint`: Lint the code using ruff.
- `make test`: Run the tests using pytest.
- `make clean`: Remove the virtual environment and other build artifacts.

## Music Files

The backend uses placeholder music files. To use your own music, replace the files in the `backend/music` directory with your own `.mid` files. The current placeholder files are:

- `coffee_shop.mid`
- `lofi_beats.mid`
- `electronic_music.mid`
- `default_music.mid`

You can also update the `MUSIC_MAPPING` dictionary in `backend/main.py` to map different objects to different music files.