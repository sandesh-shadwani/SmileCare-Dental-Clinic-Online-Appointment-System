# ⚙️ Project Setup Guide

Follow these steps exactly to get the Dental Clinic Appointment System running on your machine.

---

## ✅ Prerequisites — Install These First

Before starting, make sure you have the following installed:

| Tool        | Version     | Download Link                        |
|-------------|-------------|--------------------------------------|
| Node.js     | 18 or above | https://nodejs.org (choose LTS)      |
| npm         | comes with Node | (installed automatically)        |
| MongoDB     | 6 or above  | https://www.mongodb.com/try/download/community |
| Git         | Any         | https://git-scm.com (optional)       |

To check if Node is installed, open a terminal and run:
```bash
node --version
npm --version
```

---

## 📁 Step 1 — Get the Project Files

If you downloaded as a ZIP:
1. Extract the ZIP file
2. You'll see a folder called `dental-clinic`
3. Open that folder

If using Git:
```bash
git clone <your-repo-url>
cd dental-clinic
```

---

## 🗄️ Step 2 — Set Up MongoDB

Follow the **MONGODB_SETUP.md** file for full details. Quick summary:

**Option A (Local):**
- Install MongoDB Community Server
- It starts automatically as a service
- No extra config needed

**Option B (Atlas/Cloud):**
- Create free account at mongodb.com/atlas
- Create a cluster, get your connection string

---

## 🔧 Step 3 — Set Up the Backend

Open a terminal and navigate to the backend folder:

```bash
cd dental-clinic/backend
```

### 3a. Install dependencies
```bash
npm install
```
This installs: express, mongoose, cors, dotenv, nodemon

### 3b. Create the .env file
In the `backend` folder, create a new file named `.env` (not `.env.example`, an actual `.env` file):

**For Local MongoDB:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dental_clinic
```

**For MongoDB Atlas:**
```
PORT=5000
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/dental_clinic?retryWrites=true&w=majority
```

> ⚠️ Important: Never share your `.env` file or push it to GitHub

### 3c. Start the backend server
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

If you see this, the backend is working! Leave this terminal open.

---

## 🎨 Step 4 — Set Up the Frontend

Open a **NEW terminal window** (keep the backend terminal open) and navigate to the frontend folder:

```bash
cd dental-clinic/frontend
```

### 4a. Install dependencies
```bash
npm install
```
This installs: react, react-dom, react-router-dom, axios, vite

### 4b. Start the frontend
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

## 🌐 Step 5 — Open the App

Open your browser and go to:
```
http://localhost:3000
```

You should see the SmileCare Dental Clinic homepage!

---

## 📋 Running Both Servers — Summary

You need **two terminals** running at the same time:

**Terminal 1 — Backend:**
```bash
cd dental-clinic/backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd dental-clinic/frontend
npm run dev
# Runs on http://localhost:3000
```

---

## 🧪 Testing the API (Optional)

You can test API endpoints directly using your browser or Postman:

- Get all appointments: http://localhost:5000/api/appointments
- API health check: http://localhost:5000/

To test POST/PUT/DELETE endpoints, use **Postman** (https://www.postman.com/downloads/)

**Example: Create Appointment (POST)**
- URL: `http://localhost:5000/api/appointments`
- Method: POST
- Body (JSON):
```json
{
  "patientName": "Ali Hassan",
  "email": "ali@example.com",
  "phone": "0300-1234567",
  "appointmentDate": "2025-03-10",
  "timeSlot": "09:00 - 11:00",
  "dentist": "Dr. Sarah Ahmed",
  "treatmentType": "General Checkup",
  "notes": "First visit"
}
```

---

## ❌ Common Issues & Fixes

### "Cannot connect to MongoDB"
- Make sure MongoDB is running (check Windows Services or run `mongod`)
- Check your MONGO_URI in the `.env` file
- For Atlas: make sure your IP is whitelisted in Network Access

### "Port 5000 already in use"
- Change `PORT=5001` in your `.env` file
- Update `vite.config.js` proxy target to `http://localhost:5001`

### "Module not found" errors
- Make sure you ran `npm install` in both `backend/` and `frontend/` folders

### Frontend shows "Failed to fetch" or network errors
- Make sure the backend is running on port 5000
- Check the Vite proxy in `frontend/vite.config.js`

### Nodemon not found
- Run: `npm install -g nodemon` or use `npm start` instead of `npm run dev`

---

## 📂 Folder Explanation

```
dental-clinic/
├── backend/       ← Express JS server + MongoDB connection
├── frontend/      ← React JS app (Vite)
├── README.md      ← Project overview and API docs
├── SETUP.md       ← This file (setup instructions)
└── MONGODB_SETUP.md  ← Database connection guide
```

---

## 🛑 Stopping the Servers

In each terminal, press:
```
Ctrl + C
```

This stops both servers.
