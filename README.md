<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2bb5505f-5fc6-446b-9d74-d405f42bf18b

## Run Locally

**Prerequisites:**  [Android Studio](https://developer.android.com/studio)


1. Open Android Studio
2. Select **Open** and choose the directory containing this project
3. Allow Android Studio to fix any incompatibilities as it imports the project.
4. Start the backend (AI runs server-side on NVIDIA NIM): see [`backend/README.md`](backend/README.md)
5. Optional: create `.env` in the project directory and set `ZIRA3I_BACKEND_URL` (defaults to `http://10.0.2.2:8000`, the emulator's view of your PC; see `.env.example`)
6. Run the app on an emulator, or on a physical device after `adb reverse tcp:8000 tcp:8000` with `ZIRA3I_BACKEND_URL=http://127.0.0.1:8000`
7. If the backend is unreachable or has no valid NVIDIA key, the app automatically falls back to its offline Algerian-crop knowledge base

Command line: `./gradlew assembleDebug testDebugUnitTest` (needs `sdk.dir` in `local.properties` or `ANDROID_HOME`).
