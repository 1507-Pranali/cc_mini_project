# Student Feedback Review System

A full-stack web application for collecting and reviewing student feedback with JWT authentication, role-based dashboards, analytics, CSV export, and AI-style feedback summaries.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Axios + Chart.js
- Backend: Flask + SQLAlchemy + SQLite
- Authentication: JWT + bcrypt

## Project Structure

```text
backend/
  app.py
  models.py
  requirements.txt
  routes/
frontend/
  src/
    components/
    context/
    lib/
    pages/
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs at `http://127.0.0.1:5000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`.

## Sample Credentials

- Admin
  - Username: `admin`
  - Password: `admin123`
- Student
  - Username: `alice`
  - Password: `student123`
- Student
  - Username: `brian`
  - Password: `student123`

## API Endpoints

- `POST /api/register`
- `POST /api/login`
- `GET /api/feedback`
- `POST /api/feedback`
- `GET /api/admin/feedback`
- `DELETE /api/admin/delete/:id`
- `GET /api/admin/export`

## Features Included

- Student signup and login
- Admin login
- JWT-protected API routes
- Password hashing using bcrypt
- Feedback submission with anonymous option
- Student feedback history
- Admin filtering, delete, export, charts, and statistics
- Responsive Tailwind UI with dark mode
- Seeded sample data for quick testing

## Notes

- The SQLite database file is created automatically at `backend/feedback.db`.
- Sample data is seeded on the first run only.
- For production, change `JWT_SECRET_KEY` in the environment before deployment.
