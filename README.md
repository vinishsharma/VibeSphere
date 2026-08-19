# VibeSphere
It's a social media platform centered around sharing images and videos. It gives off a fun and interactive vibe, encouraging users to share their moments and connect with others.

## Production deployment

This repository is configured to deploy the React/Vite frontend to Vercel from the repository root. For reliable realtime messaging, deploy the Express API and Socket.IO server to a persistent Node.js host: this app keeps its online-user map in the server process, so it cannot safely be split across independently scaled function instances.

### 1. Deploy the backend

Deploy the `backend` directory to a Node.js hosting provider that supports persistent processes (for example, Render or Railway) with Node.js 20 or later. For Render, the repository includes [render.yaml](render.yaml): choose **New → Blueprint** and select this repository. It configures the `backend` root directory, `npm ci`, `npm start`, and the `/api/health` health check.

- Install command: `npm ci`
- Start command: `npm start`
- Health check: `/api/health`

Enter the secret values requested by the Blueprint from [backend/.env.example](backend/.env.example). Do not upload or commit a real `.env` file. After creating the Vercel project, add `CLIENT_ORIGIN` to Render with its HTTPS URL. More than one allowed frontend origin can be supplied as a comma-separated list.

### 2. Deploy the frontend to Vercel

1. Push this repository to GitHub.
2. In Vercel, select **Add New → Project**, import `vinishsharma/VibeSphere`, and deploy from the repository root. The committed [vercel.json](vercel.json) installs and builds `frontend` automatically and supports direct visits to React Router URLs.
3. Before the production deployment, add these Vercel environment variables for **Production** (and Preview if you need preview testing):

   | Variable | Value |
   | --- | --- |
   | `VITE_API_URL` | Public HTTPS URL of the backend, without a trailing slash |
   | `VITE_SOCKET_URL` | Public HTTPS URL of the same Socket.IO backend, without a trailing slash |
   | `VITE_GOOGLE_CLIENT_ID` | Google OAuth web-client ID (public client identifier) |

4. Redeploy after adding or changing an environment variable; Vite embeds `VITE_` variables at build time.
5. Copy the resulting `https://…vercel.app` URL into the backend's `CLIENT_ORIGIN` setting and redeploy the backend.

For local values, start with [frontend/.env.example](frontend/.env.example). The actual `.env` files are ignored by Git.

### 3. Configure Google OAuth

In Google Cloud Console, add the deployed Vercel URL under **Authorized JavaScript origins**. Keep the OAuth client secret only in the backend host's environment settings; never place it in `VITE_` variables.

### Verify

- Open `https://your-backend.example.com/api/health` and confirm it returns `{ "status": "ok" }`.
- Open the Vercel URL, sign up or sign in, then test an upload and a realtime message.
- If auth requests are rejected, confirm both frontend and backend are HTTPS and that `CLIENT_ORIGIN` exactly matches the Vercel origin (no trailing slash).
