# RRDCH — Rajarajeswari Dental College & Hospital Portal

A full-stack web application for the official RRDCH website with role-based internal portals for Admin, PG Doctors, and Students.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Framer Motion |
| Backend | Node.js + Express.js |
| Database | SQLite (via sqlite3) |
| Auth | JWT (jsonwebtoken) |
| Styling | Vanilla CSS + Tailwind utilities |
| File Uploads | Multer |

## Features

### Public Website
- SEO-optimised homepage with JSON-LD structured data (CollegeOrUniversity + Dentist)
- Campus Gallery, News & Announcements, Calendar of Events, Faculty Directory
- Online Appointment Booking + Live Queue Tracker
- Admissions Application Form

### Admin Portal (`/admin`)
- Manage all appointments + assign patients to PG doctors
- Gallery CMS with file upload or URL paste
- News, Events, Faculty, Schedule, and Library management
- User credential creation & force-reset with inline modal
- Live system status dashboard (real uptime, DB tables, Node.js version)

### PG Doctor Portal (`/pg-dashboard`)
- See only **assigned** patients (admin-assigned)
- Case logs, duty roster, live queue management
- Research papers & academic library

### Student Portal (`/student-dashboard`)
- Clinical schedule, exam timetable, attendance tracker
- Digital library with downloadable materials
- Hostel complaint lodging

### Patient Portal (`/patient-portal`)
- Book OPD appointment
- Live queue status per department
- Track appointment by phone + ID
- Follow-up request form

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/rrdch.git
cd rrdch

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install

# 4. Create environment file
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# 5. Start backend (from /server directory)
node server.js

# 6. Start frontend (from root directory)
cd ..
npm run dev
```

The frontend runs on http://localhost:5173 and the backend on http://localhost:5000.


## Folder Structure

```
rrdch/
├── index.html           # SEO-optimised HTML shell
├── src/
│   ├── pages/           # All page components
│   ├── components/      # Reusable UI components
│   ├── context/         # Auth + Language context
│   └── main.jsx
├── server/
│   ├── server.js        # Express API + all routes
│   ├── database.js      # SQLite schema + seeding
│   ├── .env.example     # Environment variable template
│   └── uploads/         # Uploaded gallery images (gitignored)
└── public/
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|---|---|
| `JWT_SECRET` | Long random string for JWT signing (min 32 chars) |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |

