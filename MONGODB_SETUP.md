# MongoDB Setup Guide

This guide explains how to connect the Dental Clinic app to MongoDB in a basic, step-by-step way.

---

## Option A — Local MongoDB (Install on your PC)

### Step 1: Install MongoDB Community Server
1. Go to: https://www.mongodb.com/try/download/community
2. Choose your OS (Windows / macOS / Linux), version = latest, package = MSI (Windows) or DMG (macOS)
3. Download and run the installer
4. During installation, check **"Install MongoDB as a Service"** so it starts automatically
5. Also install **MongoDB Compass** (the GUI) — it's offered during installation

### Step 2: Verify MongoDB is Running
Open a terminal and run:
```bash
mongod --version
```
You should see the version number. If MongoDB is installed as a service, it starts automatically on boot.

To manually start:
- **Windows**: Open Services → find "MongoDB" → Start
- **macOS/Linux**: `brew services start mongodb-community` or `sudo systemctl start mongod`

### Step 3: Create the .env file
Inside the `backend/` folder, create a file named `.env` (copy from `.env.example`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dental_clinic
```

That's it! When your backend runs, Mongoose will:
- Connect to your local MongoDB server
- Automatically create a database called `dental_clinic`
- Automatically create a collection called `appointments`

---

## Option B — MongoDB Atlas (Cloud, No Installation)

Use this if you don't want to install MongoDB locally.

### Step 1: Create a Free Account
Go to: https://www.mongodb.com/cloud/atlas/register

### Step 2: Create a Cluster
1. Click **"Build a Cluster"**
2. Choose **FREE (M0 Shared)** tier
3. Pick any region close to you
4. Click **Create**

### Step 3: Create a Database User
1. In the left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set a username and password (remember these!)
5. Role: **Atlas Admin** → Click Add User

### Step 4: Allow Network Access
1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
4. Click **Confirm**

### Step 5: Get Your Connection String
1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

### Step 6: Create the .env file
Inside the `backend/` folder, create `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/dental_clinic?retryWrites=true&w=majority
```
Replace `yourUsername` and `yourPassword` with the ones you set in Step 3.

---

## How the Connection Works in Code

The connection is handled by `backend/config/db.js`:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
```

It is called once in `server.js` when the backend starts. If connection fails, the server stops and shows the error.

---

## Verifying Data with MongoDB Compass

1. Open MongoDB Compass
2. Connect using: `mongodb://localhost:27017` (local) or your Atlas connection string
3. You'll see the `dental_clinic` database appear after the first appointment is created
4. Inside it, you'll find the `appointments` collection with all records
