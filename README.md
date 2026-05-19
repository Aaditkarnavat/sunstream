# Sunstream

**Cardiff Metropolitan University | Mobile and Web Technologies Module**

A peer-to-peer solar energy trading platform built with React, Node.js, and Firebase.

## Overview

Sunstream enables prosumers (solar energy producers) to trade energy credits with consumers. The application simulates real-time energy transactions, user authentication, and grid carbon intensity integration.

## Features

- **User Authentication** – Firebase Authentication for secure login and role-based access
- **Energy Trading Dashboard** – Frontend interface for browsing, creating, and managing energy offers
- **Real-time Data** – Firestore for live updates and data persistence
- **Grid Carbon Intensity** – Integration with UK Carbon Intensity API for sustainability metrics
- **Cloud Deployment** – Firebase Hosting for frontend, custom Node.js backend for API endpoints

## Tech Stack

- **Frontend:** React, Vite, JSX
- **Backend:** Node.js, Express.js
- **Database & Auth:** Firebase (Firestore, Authentication)
- **External APIs:** UK Carbon Intensity API
- **Deployment:** Firebase Hosting

## Project Structure

```
sunstream/
├── frontend/       # React + Vite frontend
├── backend/        # Node.js API server
├── shared/         # Shared utilities and types
├── n/              # Node modules and configuration
├── .firebaserc     # Firebase project config
└── firebase.json   # Hosting and Firestore rules
```

## How to Run

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend**
```bash
cd backend
npm install
node index.js
```

---

*A. Karnavat
