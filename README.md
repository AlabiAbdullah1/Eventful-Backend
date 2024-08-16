# Eventful Backend

Eventful is a backend service built with TypeScript, Node.js, and MongoDB, designed to handle user registrations, event management, and reminders. This service includes features such as JWT-based authentication, email notifications, and cron jobs for reminder scheduling.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Cron Jobs](#cron-jobs)


## Features

- User and organization registration
- JWT-based authentication
- Event creation and management
- Reminder setting with email notifications
- Integration with MongoDB for data persistence
- Cron jobs for automated tasks

## Technologies

- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for sending emails
- Cron for scheduling tasks

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/eventful-backend.git
   cd eventful-backend

   npm install  or  yarn install

### Configuration
1. **Environment Variables:**
	```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
	JWT_SECRET=your_jwt_secret
	EMAIL_HOST=your_email_host
	EMAIL_PORT=your_email_port	
	EMAIL_USER=your_email_username
	EMAIL_PASS=your_email_password
 2. **Database:**
Ensure your MongoDB instance is running and accessible via the MONGO_URI specified in your .env file.

### Running the project
1. **Development Mode:**
   ```bash
   npm run dev

2. **Production Mode:**
   ```bash
   npm run build

   npm run start

 ### Cron Jobs
The project uses cron jobs to handle scheduled tasks like sending email reminders for upcoming events. The cron jobs are defined in a separate file and integrated into the main application.






