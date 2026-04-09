# Bifrost Frontend

This is a Vite + React + TypeScript frontend that uses Google OAuth for login.

## Environment setup

Google login requires a client ID in a Vite environment variable.

1. Create a `.env.local` file in the project root.
2. Add your Google OAuth Web Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

3. Restart the frontend (`npm run dev`) after changing env values.

If this variable is missing, the app now shows a configuration message instead of attempting a broken OAuth request.
