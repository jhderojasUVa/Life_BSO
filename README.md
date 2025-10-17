# BSO of Your Life

This project is a web application that uses your camera to recognize objects and plays different music based on the recognized object.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker and Docker Compose
- Python 3.9+ and Poetry
- Node.js and npm

### Installation

1. **Clone the repo:**
   ```sh
   git clone https://github.com/your_username/Life_BSO.git
   cd Life_BSO
   ```

2. **Install dependencies:**
   This project uses a `Makefile` to simplify the installation process. The following command will install both the frontend and backend dependencies:
   ```sh
   make install
   ```

## Development

This project is set up as a monorepo with a frontend and a backend. You can run the application using Docker or manually using the root `Makefile`.

### Using Docker

To run the application using Docker, you will need to have Docker and Docker Compose installed.

- `make docker-up`: Build and run the containers.
- `make docker-down`: Stop and remove the containers.

### Running Manually

- `make run`: Run both the frontend and the backend development servers.
- `make lint`: Lint both the frontend and the backend.
- `make clean`: Clean the backend build artifacts.

## Backend

The backend is a Python application built with the **FastAPI** framework. It uses a pre-trained **TensorFlow** model (MobileNetV2) to perform image recognition.

### Logging

The backend uses a custom logger to print color-coded messages to the console. The logger is defined in `backend/logger.py` and is used in `backend/main.py` to log requests and other important events.

### Music Files

The backend uses placeholder music files. To use your own music, replace the files in the `backend/music` directory with your own `.mid` files. The current placeholder files are:

- `coffee_shop.mid`
- `lofi_beats.mid`
- `electronic_music.mid`
- `default_music.mid`

You can also update the `MUSIC_MAPPING` dictionary in `backend/main.py` to map different objects to different music files.

## Frontend

The frontend is a **React** application built with **Vite**. It uses **TypeScript** and **CSS** for styling.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request