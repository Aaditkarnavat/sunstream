# Sunstream

React + Vite + Firebase web app for sharing solar energy between prosumers and consumers.

## How to run (frontend)

Requirements: Node.js LTS.

1. Open a terminal:
   cd sunstream/frontend

2. Install dependencies:
   npm install

3. Start the dev server:
   npm run dev

4. Open the URL shown in the terminal (usually http://localhost:5173).

## How to run (backend)

The backend provides API endpoints for offers and recommendations.

1. Open a second terminal:
   cd sunstream/backend

2. Install Dependencies and start backend server
   cd sunstream/backend : node index.js

3. Backend will run on http://localhost:3000


## Notes

- Firebase Authentication and Firestore are used for authentication and data storage.
- External API: UK Carbon Intensity API for live grid carbon intensity.
