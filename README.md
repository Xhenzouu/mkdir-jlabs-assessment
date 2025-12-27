# IP Geolocation Web App

A sample **React + Vite web application** with a **Node.js (Express) backend**.

This project demonstrates authentication, API integration, and IP geolocation features.

- Separate API Repository (Node.js)  
- Separate Web Repository (React)  
- Login API running on `http://localhost:8000/api/login`  
- IP Geolocation using `https://ipinfo.io/geo`  
- Designed to be tested on another local machine  
- Frontend deployable to Vercel  

---

## Tech Stack

**Frontend**  
- React  
- Vite  
- Axios  
- Leaflet (for map display)  

**Backend**  
- Node.js  
- Express  
- dotenv  

---

## Features Implemented

### App Flow
- On app load:
  - Redirects to **Login** if not authenticated
  - Redirects to **Home** if authenticated

### Login Screen
- Email and password login form
- Credentials validated against a seeded user (User Seeder)
- Redirects to Home after successful login
- Login API: `POST http://localhost:8000/api/login`
- Example seeded credentials (for testing/demo purposes only):

Email: test@example.com
Password: password123

> **Note:** This account is for demonstration and testing purposes only. You can modify or add more test users by running the seeder in `api/seeders/seedUser.js`.

### Home Screen
- Displays IP & geolocation information of the logged-in user
- Search for a new IP address and display its geolocation
- Validation and error handling for invalid IP addresses
- Clear search to revert back to the user’s IP
- Displays a list of searched IP history

### Optional / Plus Points Implemented
- Clickable history items to re-display geolocation
- Checkbox selection for deleting multiple history records
- Map display with marker pinned to the IP’s exact location

---

## Setup Instructions (For Reviewers)

### Backend API (Node.js)
```bash
cd api
npm install
cp .env.example .env   # or create .env manually with:
# JWT_SECRET=secret
# IPINFO_TOKEN=your_ipinfo_token
npm start

Runs on: http://localhost:8000

Frontend Web App (React)

cd web
npm install
npm run dev

Runs on: http://localhost:5173
The frontend communicates with the backend via: http://localhost:8000/api

Deployment
Frontend is deployable on Vercel
Backend API is intended to run locally using the provided login API URL

Notes
All external libraries are declared in package.json as required
Complete setup steps ensure the project can be tested on another local machine

Author
Henson Brix A. Arroyo