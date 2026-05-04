# Mileage Assist

## Overview

Mileage Assist is a web application that allows users to manage clients and track visit information such as mileage, locations, and reasons for visits. It has the capability of displaying a spreadsheet, and exporting it into external software using a CSV file.

## Features

- User authentication (Firebase)
- Add and manage clients
- Log visit details (odometer, locations, reason)
- Search clients
- Simple UI for tracking data

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Python (Flask)
- Database: SQLite
- Data Format: JSON
- Authentication: Firebase
- Deployment: Render

## API Endpoints

### Get Clients (GET)

/clients?user_uid=USER_ID  
Returns all clients for a specific user.

**Response (JSON):**

```json
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "program": "MDFT"
  }
]
```

### Add Visit (POST)

/visits

**Request body:**

```json
{
  "client_id": 1,
  "user_uid": "abc123",
  "odometer_start": "100",
  "odometer_end": "120",
  "location_start": "Home",
  "location_end": "Office",
  "reason": "Session"
}
```

## How to Run Locally

1. Install Python
2. Install dependencies:  
   pip install flask flask-cors (Windows)  
   pip3 install flask flask-cors (macOS/Linux)

3. Run:  
   python mileage_assist.py

4. Open:  
   http://127.0.0.1:5000

## Live Application

https://mileage-assist-cmsc-319-final-project.onrender.com

## Notes

- The system uses JSON to send and receive data between the frontend and backend.
- The application is deployed on Render.
- GitHub contains the files to run it locally.
- When the application first loads, it may take a few seconds to start due to Render's free tier limitations.
