# 🦷 SmileCare Dental Clinic — Online Appointment System

A full-stack web application for managing dental clinic appointments. Patients can browse available time slots, book appointments, view, edit, and cancel them — all through a clean and user-friendly interface.

---

## 📌 Project Overview

**Type:** Semester Project — Full-Stack Web Application  
**Category:** Online Appointment Management System  
**Domain:** Healthcare / Dental Clinic

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React JS (Vite), React Router v6  |
| Backend    | Node.js, Express JS               |
| Database   | MongoDB, Mongoose ODM             |
| Styling    | Plain CSS with CSS Variables      |
| HTTP       | Axios                             |

---

## ✨ Features

### Patient-Facing
- **Homepage** — Services, dentists, time slots info, and call-to-action
- **Book Appointment** — Dynamic form with real-time slot availability checking
- **View All Appointments** — Search, filter by status and dentist, sortable list
- **Appointment Details** — Full info view with status stepper and quick updates
- **Edit Appointment** — Pre-filled form to update any appointment details
- **Delete Appointment** — Confirmation modal before permanent deletion

### System Features
- Prevents double-booking (same date + slot + dentist = conflict)
- Weekday-only validation (Mon–Fri, 9 AM – 5 PM)
- Past date prevention
- Form validation on both frontend and backend
- HTTP status codes and error messages
- Success and error feedback on all actions
- Responsive design for mobile and desktop

---

## 🗓️ Time Slots

| Slot           | Period       |
|----------------|--------------|
| 09:00 – 11:00  | Morning      |
| 11:00 – 13:00  | Late Morning |
| 13:00 – 15:00  | Afternoon    |
| 15:00 – 17:00  | Late Afternoon |

Available: **Monday to Friday only**

---

## 👨‍⚕️ Dentists

- Dr. Sarah Ahmed — General & Cosmetic Dentistry
- Dr. Omar Khalid — Orthodontics & Root Canal
- Dr. Fatima Rizvi — Pediatric & Preventive Care

---

## 📁 Project Structure

```
dental-clinic/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── appointmentController.js  # All CRUD logic
│   ├── middleware/
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   └── Appointment.js         # Mongoose schema
│   ├── routes/
│   │   └── appointmentRoutes.js   # API route definitions
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx / .css
│   │   │   ├── Footer.jsx / .css
│   │   │   └── AppointmentCard.jsx / .css
│   │   ├── context/
│   │   │   └── AppointmentContext.jsx  # Global state (React Context)
│   │   ├── pages/
│   │   │   ├── Home.jsx / .css
│   │   │   ├── BookAppointment.jsx / .css
│   │   │   ├── AppointmentsList.jsx / .css
│   │   │   ├── AppointmentDetail.jsx / .css
│   │   │   └── EditAppointment.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios API calls
│   │   ├── App.jsx                # Routes
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── MONGODB_SETUP.md               # Database setup guide
├── SETUP.md                       # Project setup instructions
└── README.md                      # This file
```

---

## 🔌 API Endpoints

| Method | Route                                    | Description                    |
|--------|------------------------------------------|--------------------------------|
| GET    | `/api/appointments`                      | Get all appointments           |
| GET    | `/api/appointments/:id`                  | Get single appointment         |
| GET    | `/api/appointments/available-slots`      | Check available slots for date + dentist |
| POST   | `/api/appointments`                      | Create new appointment         |
| PUT    | `/api/appointments/:id`                  | Full update of appointment     |
| PATCH  | `/api/appointments/:id`                  | Partial update (e.g. status)   |
| DELETE | `/api/appointments/:id`                  | Delete appointment             |

### Query Parameters for GET /api/appointments
- `status` — filter by status (pending / confirmed / cancelled / completed)
- `date` — filter by specific date (YYYY-MM-DD)
- `dentist` — filter by dentist name

---

## 📊 Database Schema — Appointment

| Field           | Type    | Required | Notes                                   |
|----------------|---------|----------|-----------------------------------------|
| patientName    | String  | ✅        | 2–100 characters                        |
| email          | String  | ✅        | Valid email format                      |
| phone          | String  | ✅        | 7–20 characters                         |
| appointmentDate| Date    | ✅        | Must be a weekday, cannot be past       |
| timeSlot       | String  | ✅        | Enum of 4 slots                         |
| dentist        | String  | ✅        | Enum of 3 dentists                      |
| treatmentType  | String  | ✅        | Enum of 9 treatment types               |
| notes          | String  | ❌        | Max 500 characters                      |
| status         | String  | ❌        | Default: pending                        |
| createdAt      | Date    | Auto      | Mongoose timestamps                     |
| updatedAt      | Date    | Auto      | Mongoose timestamps                     |



## 👨‍💻 Academic Information

- **Course:** Enterprise Web Application
- **Project Type:** Semester Project
- **Application Type:** Three-Tier Web Application (Frontend → Backend → Database)
- **Name:** Sandesh Shadwani