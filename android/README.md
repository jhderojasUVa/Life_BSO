# BSO of Your Life Android Prototype

Android prototype that:
- Shows camera preview with front/back selection.
- Captures one image every 3-10 seconds while running.
- Runs fully on-device with local image labeling and bundled music by default.
- Can optionally send each image to the Life_BSO backend endpoint.

## Stack
- Kotlin + AndroidX
- CameraX (preview + image capture)
- ML Kit on-device image labeling
- OkHttp for multipart upload
- Android MediaPlayer for playback
- JUnit4 unit tests

## Modes
The app supports two prediction modes:
1. Local self-contained mode (default): no backend required.
2. Backend mode: sends image to Life_BSO backend `/predict`.

You can switch mode at runtime from the app UI using the Mode switch:
- `Local` uses on-device ML Kit and bundled music files.
- `Backend` sends captures to `BACKEND_BASE_URL` and streams returned music.
- Switching mode while capture loop is running stops the loop safely; press Start again.
- The selected mode is saved and restored automatically on next app launch.
- Selected camera (front/back) and interval (3-10s) are also saved and restored.
- If capture was running, the app auto-resumes on next launch after a short camera-readiness delay.

Mode toggle lives in `app/build.gradle.kts`:
```kotlin
buildConfigField("boolean", "USE_LOCAL_INFERENCE", "true")
```

- `true` = local self-contained mode.
- `false` = backend mode.

## Local self-contained mode (default)
What runs on-device:
- Camera capture pipeline.
- ML Kit label inference.
- Label-to-music mapping.
- Playback from bundled app resources in `app/src/main/res/raw`.

Bundled tracks:
- `coffee_shop.mid`
- `lofi_beats.mid`
- `electronic_music.mid`
- `default_music.mid`

## Backend mode contract
This app sends:
- `POST {BACKEND_BASE_URL}/predict`
- `multipart/form-data`
- parts:
  - `file`: jpg file

Expected backend JSON response (flexible fields are supported):
```json
{
  "object": "keyboard",
  "music_file": "lofi_beats.mid"
}
```

Accepted label fields: `object`, `label`, `prediction`.
Accepted music fields: `music_file`, `music_url`, `song_url`.

When `music_file` is returned, the app builds the stream URL as:
- `{BACKEND_BASE_URL}/music/{music_file}`

## Configuration
Default backend base URL is in app build config and matches emulator access to local backend:
- `http://10.0.2.2:8000` (Android emulator to host machine)

Update in [app/build.gradle.kts](app/build.gradle.kts) if needed:
```kotlin
buildConfigField("String", "BACKEND_BASE_URL", "\"http://10.0.2.2:8000\"")
```

For physical device testing, use your computer LAN IP and ensure same network.

## Prerequisites
1. Android Studio (latest stable recommended).
2. Android SDK Platform 34 and Build Tools installed.
3. JDK 17 configured in Android Studio.
4. Python backend dependencies installed for Life_BSO backend.

## Start backend (required only for backend mode)
1. Open a terminal in `/Projects/Life_BSO/backend`.
2. Run with Poetry:
  - `poetry install`
  - `poetry run uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
3. Verify backend is up:
  - `http://localhost:8000/health`

## Compile and run in Android Studio
1. Open `/Projects/BSO_of_your_life_Android` in Android Studio.
2. Wait for Gradle sync to finish.
3. Build the app from menu:
  - Build > Make Project
4. Run unit tests from menu:
  - Run > Run 'All Tests'
5. Start on emulator or device using Run.

## Run on Android emulator (local mode)
1. Ensure `USE_LOCAL_INFERENCE` is set to `true`.
2. Launch an Android emulator.
3. Run the app.

## Run on Android emulator (backend mode)
1. Set `USE_LOCAL_INFERENCE` to `false`.
1. Keep `BACKEND_BASE_URL` as `http://10.0.2.2:8000`.
2. Launch an Android emulator.
3. Run the app.

## Run on physical Android device (local mode)
1. Ensure `USE_LOCAL_INFERENCE` is set to `true`.
2. Build and install app on device.
3. No server connection is required.

## Run on physical Android device (backend mode)
1. Set `USE_LOCAL_INFERENCE` to `false`.
Choose one connectivity option.

Option A: Same Wi-Fi network
1. Find your computer LAN IP (example: `192.168.1.50`).
2. Update `BACKEND_BASE_URL` in `app/build.gradle.kts` to `http://<LAN_IP>:8000`.
3. Ensure firewall allows inbound TCP 8000.
4. Rebuild and install the app on device.

Option B: USB with adb reverse
1. Keep device connected via USB with developer options and USB debugging enabled.
2. Keep `BACKEND_BASE_URL` as `http://127.0.0.1:8000` in `app/build.gradle.kts`.
3. Run on host machine:
  - `adb reverse tcp:8000 tcp:8000`
4. Rebuild and install the app.

## In-app test flow
1. Grant camera permission.
2. Select back or front camera.
3. Set interval from 3 to 10 seconds.
4. Press Start.
5. Confirm prediction text updates and returned music plays.
6. Press Stop to end timed captures.

## Testing
Unit tests added:
- `InferenceClientTest` (response parsing and music URL mapping)
- `CaptureRetryPolicyTest` (exponential backoff behavior)
- `ObjectMusicMapperTest` (on-device label to music mapping)

Run tests in terminal (when Gradle wrapper is available):
- `./gradlew test`

## Notes
- This is a prototype and does not persist captures.
- Captured files are temporary and deleted after upload.
- If backend does not return a music file or URL, playback is skipped.
- Backend prediction calls now retry with exponential backoff.
- Audio transitions use a short crossfade to reduce abrupt cuts.
- Local self-contained mode does not require network or backend server.
