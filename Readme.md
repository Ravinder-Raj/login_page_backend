# Backend Project Name

This is the backend repository for the login_page project. It includes the server-side code responsible for handling API requests and managing the database.

## Setting Up the Database

### Prerequisites
- XAMPP server installed on your machine

### Instructions
1. Start the XAMPP server if it's not already running.
2. Open a web browser and navigate to `http://localhost/phpmyadmin`.
3. Log in to phpMyAdmin with your credentials.
4. Create a new database named `signup` if it doesn't already exist.
5. Execute the following SQL query to create the `login1` table within the `signup` database:

```sql
CREATE TABLE IF NOT EXISTS login1 (
    id INT(255) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    age VARCHAR(255) NOT NULL,
    dob VARCHAR(255) NOT NULL,
    contact VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


Once the table is created, you're ready to run the backend server.
Running the Backend Server
Prerequisites
Node.js and npm installed on your machine
Instructions
Clone this repository to your local machine.
Navigate to the project directory in your terminal.
Install dependencies using the command:

npm install

Start the backend server using the command:

npm start

The server should now be running on http://localhost:8081.
API Endpoints
Authentication
POST /register: Register a new user.
POST /login: Log in an existing user.
User Management
GET /: Get user information (requires authentication).
POST /UpdateProfile: Update user profile (requires authentication).

