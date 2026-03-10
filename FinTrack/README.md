# FinTrack

FinTrack is a comprehensive financial tracking application designed to help users manage their finances effectively. It features a modern, responsive React frontend and a robust Django backend, providing a seamless user experience for tracking transactions, viewing insights, and managing user profiles.

## Features

### User Features
*   **Secure Authentication**: User registration and login with JWT-based authentication.
*   **Profile Management**: Users can update their personal details (First Name, Last Name, Email) and view their profile status.
*   **Responsive Design**: A modern UI with a collapsible sidebar, optimized for both desktop and mobile devices.
*   **Financial Dashboard**: (In Progress) View transactions, reports, and AI-driven insights.

### Admin Features
*   **Admin Dashboard**: A dedicated panel for administrators to manage the platform.
*   **User Management**: View a list of all registered users with their details.
*   **Status Control**: Toggle user accounts between Active and Inactive states.
*   **User Deletion**: Remove user accounts from the system.
*   **Manual Registration**: Admins can manually register new users via the dashboard.

## Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: CSS Modules, Vanilla CSS (Green/Emerald Theme)
*   **Icons**: Lucide React, Tabler Icons
*   **Routing**: React Router DOM
*   **HTTP Client**: Axios

### Backend
*   **Framework**: Django
*   **API**: Django REST Framework (DRF)
*   **Authentication**: SimpleJWT
*   **Database**: SQLite (Default) / PostgreSQL (Supported)

## Getting Started

### Prerequisites
*   Node.js (v16+)
*   Python (v3.8+)
*   npm or yarn

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd FinTrack
```

#### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd Backend_new
# Create a virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements/requirements.txt

# Run migrations
cd fintrack_backend
python manage.py migrate

# Create a superuser (for Admin access)
python manage.py createsuperuser

# Start the server
python manage.py runserver
```
The backend will run at `http://localhost:8000`.

#### 3. Frontend Setup
Navigate to the frontend directory and install dependencies.

```bash
cd Frontend
npm install

# Start the development server
npm run dev
```
The frontend will run at `http://localhost:5173`.

## Admin Access

To access the Admin Dashboard:
1.  Log in with your superuser credentials (created in the Backend Setup step).
2.  Open the Sidebar.
3.  Click on **Admin Panel**.

## Project Structure

```
FinTrack/
├── Backend_new/            # Django Backend
│   ├── fintrack_backend/   # Main Project Directory
│   ├── requirements/       # Python Dependencies
│   └── ...
├── Frontend/               # React Frontend
│   ├── src/
│   │   ├── Pages/          # Page Components (Login, Register, Profile, Admin)
│   │   ├── components/     # Reusable Components (Sidebar, Dashboard)
│   │   ├── services/       # API Services (authService)
│   │   └── ...
│   └── ...
└── README.md               # Project Documentation
```

## Contributing
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.
