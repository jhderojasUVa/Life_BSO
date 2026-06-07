# Life BSO

**Body, Soul, and Mind**

This project includes web and Android applications that use the camera to recognize objects and play different music based on the recognized object. It's designed to create a personalized atmosphere based on your environment.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker and Docker Compose
- Python 3.9+ and Poetry
- Node.js and npm
- Android Studio (for the Android app)

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

This project is set up as a monorepo with frontend, backend, and Android modules. You can run the web application using Docker or manually using the root `Makefile`.

### Using Docker

To run the application using Docker, you will need to have Docker and Docker Compose installed.

- `make docker-up`: Build and run the containers.
- `make docker-down`: Stop and remove the containers.

### Running Manually

- `make` or `make help`: Show all root commands and prerequisites.
- `make run`: Run both the frontend and the backend development servers.
- `make lint`: Lint both the frontend and the backend.
- `make test`: Run frontend, backend, and Android unit tests.
- `make build`: Build the web app and Android debug APK.
- `make android-test`: Run Android unit tests only.
- `make android-build`: Build Android debug APK only.
- `make clean`: Clean the backend build artifacts.

Android commands in the root `Makefile` use this order:
1. `android/gradlew` (if present)
2. system `gradle` (if installed)

If neither exists, the Makefile prints guidance to either generate the wrapper from Android Studio or install Gradle.

## Backend

For more information about the backend, see the [backend README](./backend/README.md).

## Frontend

For more information about the frontend, see the [frontend README](./frontend/web/README.md).

## Android

The Android module is located at `android/`.

- Open `android/` in Android Studio.
- Follow Android setup and run instructions in [android README](./android/README.md).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request