# Scholarship Application Management System

A full-stack web application that helps students discover scholarships, submit applications, and track their application status. Administrators can manage scholarship listings and review student applications.

## Live Demo

- **Frontend:** https://scholarship-application-frontend.onrender.com
- **Backend:** https://scholarship-application-system-lern.onrender.com
- **Source Code:** https://github.com/deva2407-eng/Scholarship-Application-System

## Project Objectives

- Provide a central place for students to view available scholarships.
- Support student registration and login.
- Allow students to apply for scholarships and view their applications.
- Provide administrative pages for managing scholarships and reviewing applications.
- Store application data in a database through a backend API.

## Main Features

### Student
- Register and log in.
- View available scholarships.
- Access student pages after authentication.
- Submit scholarship applications.
- View submitted applications and their statuses.

### Administrator
- Access the dedicated administrator login page.
- Access administrator pages for scholarship management.
- Review scholarship applications.

> Availability of individual actions depends on the account role and the data currently stored in the connected database.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- React Router (for page navigation)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Application Structure

The project is organized into separate frontend and backend applications.

```text
Scholarship-Application-System/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── ...
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

The exact files may vary slightly depending on the current repository version.

## Getting Started Locally

### Prerequisites
- Node.js and npm
- A MongoDB database, such as MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone https://github.com/deva2407-eng/Scholarship-Application-System.git
cd Scholarship-Application-System
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory. Add your own values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5001
```

Do not commit `.env` or share database credentials and secret keys.

Start the backend:

```bash
npm start
```

If the project does not define a `start` script, check `backend/package.json` and use its configured development command (for example, `npm run dev`).

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Use the local URL printed by Vite in the terminal.

The frontend must be configured to send API requests to the backend URL you are using. For local development, use your local backend URL; for the deployed application, use the deployed backend URL.

## Deployment

The application is deployed using Render:

- The frontend is hosted as a static site.
- The backend runs as a web service.
- The backend uses MongoDB Atlas for database connectivity.

Deployment availability depends on the hosting services and their current configuration.

## Authentication and Security

- Passwords are hashed using `bcryptjs` before storage.
- JWTs are used to identify authenticated users on protected requests.
- Role-based route protection separates student and administrator pages.
- Database connection strings and JWT secrets should be stored as environment variables, not committed to the repository.

## API Overview

The backend exposes API routes for authentication, scholarships, and applications. The exact endpoints and request formats are defined in the backend `routes/` and `controllers/` directories.

The backend root URL can be used as a basic deployment health check:
https://scholarship-application-system-lern.onrender.com

## Future Improvements

- Add automated tests for frontend and backend flows.
- Improve validation and user-facing error messages.
- Add stronger administrative account provisioning and management.
- Expand application status notifications and reporting.
- Improve deployment monitoring and database backup procedures.

## Author

Developed as an academic project: **Scholarship Application Management System**.
# Scholarship-Application-System
A web-based scholarship application management system
