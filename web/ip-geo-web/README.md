# IP Geolocation Web App – JLabs Assessment

A React + Vite web application that displays IP geolocation information for the logged-in user and any searched IP. This project also includes a Node.js backend API to fetch geolocation from [ipinfo.io](https://ipinfo.io/) securely using an API token.

---

## Features

- **Login System**  
  - Login using email and password.
  - Redirects to Home Screen upon successful login.
  - User seeder provided for testing credentials.

- **Home Screen**  
  - Displays the user's current IP geolocation.
  - Search for any IP and display its geolocation.
  - Map view with markers for current and searched IPs.
  - Error handling for invalid IP addresses.
  - Search history list with optional delete multiple histories.

- **Plus Points Features**  
  - Click history items to re-display their geolocation.
  - Map pins the exact location of the IP.

---

## Project Structure

jlabs-assessment/
│
├─ api/ # Backend (Node.js/Express)
│ ├─ routes/
│ │ ├─ auth.js
│ │ ├─ ip.js
│ │ └─ history.js
│ ├─ app.js
│ ├─ package.json
│ └─ .env # Environment variables (IPINFO_TOKEN)
│
├─ web/ # Frontend (React + Vite)
│ ├─ src/
│ │ ├─ pages/
│ │ │ └─ Home.jsx
│ │ ├─ components/
│ │ │ └─ Card.jsx
│ │ └─ services/
│ │ └─ api.js
│ ├─ package.json
│ └─ vite.config.js
│
└─ README.md

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/jlabs-assessment.git
cd jlabs-assessment

2. Backend Setup

cd api
npm install

Create a .env file in api/:

IPINFO_TOKEN=your_ipinfo_token_here

Start the backend server:

npm start
# Runs on http://localhost:8000

3. Frontend Setup

cd ../web
npm install
npm run dev
# Runs on http://localhost:5173

The frontend calls the backend at http://localhost:8000/api for IP geolocation data.