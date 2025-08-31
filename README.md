<img width="1024" height="248" alt="Logo1" src="https://github.com/user-attachments/assets/1466ce8b-fadb-406b-b9b6-262c86377ac8" />


# ✨ AI-Powered Presentation Generator

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Ballerina](https://img.shields.io/badge/Ballerina-464646?style=for-the-badge&logo=ballerina&logoColor=FF7300)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Unsplash API](https://img.shields.io/badge/Unsplash%20API-000000?style=for-the-badge&logo=unsplash&logoColor=white)



Transform your ideas into stunning, editable presentations instantly. Webify.me leverages a powerful dual-backend system to automate content writing, design, and image sourcing, allowing you to focus on your message.



## 🚀 About The Project

Webify.me is a full-stack web application designed to solve a common problem: the time and effort required to create professional presentations. By simply providing a topic, our application uses AI to generate a complete presentation, which can then be customized in a real-time, interactive editor.

This project is built on a modern, distributed architecture featuring a React frontend, a Python service for AI tasks, and a robust Ballerina service for core backend logic and user management.

## ✅ Key Features

* **AI-Powered Content Generation**: Automatically creates presentation outlines, slide content, and titles.
* **Dynamic Image Sourcing**: Intelligently finds and embeds relevant images from Unsplash.
* **Interactive WYSIWYG Editor**: Drag, drop, resize, and edit every element of your presentation.
* **Secure User Authentication**: Complete user management system for signing up, logging in, and managing profiles.
* **Personalized Dashboards**: Save, view, edit, and manage all your created presentations.
* **Community & Trending Section**: Discover popular presentations created by other users.
* **Admin & Notification System**: A full administrative backend to manage users and send platform-wide notifications via email.

## 🛠️ Tech Stack & Architecture

We employ a sophisticated microservices architecture to ensure scalability and separation of concerns.

* **Frontend**: A modern, responsive user interface built with **React**.
* **AI Engine (Python/Flask)**: A specialized service dedicated to creative tasks. It interfaces with **Google's Gemini API** for content generation and the **Unsplash API** for images.
* **Core Backend (Ballerina)**: The platform's foundation. This highly efficient, secure service handles all business logic, including user authentication, profile management, notification delivery, and all primary interactions with our database.
* **Database**: **MongoDB** serves as our flexible and scalable NoSQL database for storing all user and presentation data.

## 📁 Project Structure

The repository is organized with the React project at the root and the two backend services nested within a `Backend` directory.

<img width="331" height="223" alt="image" src="https://github.com/user-attachments/assets/49a6fe31-380e-4e81-b6b5-9f7fbb45ed8a" />



## ⚙️ Getting Started

To get a local copy up and running, please follow these steps.

### Prerequisites

Ensure you have the following software installed on your machine:
* [Node.js](https://nodejs.org/) (v18.x or later)
* [Python](https://www.python.org/) (v3.10 or later)
* [Ballerina](https://ballerina.io/) (Swan Lake version)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/nngeek195/Presentation-Generator.git
    cd webify.me
    ```

2.  **Environment Variables**
    Create a `.env` file in the root of the **`Python/`** directory. This file will store your secret keys and database connection string. You can copy the template from `.env.example` if you create one.

    ```ini
    # Backend/Python/.env
    MONGO_URI="mongodb://localhost:27017/"
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    UNSPLASH_ACCESS_KEY="YOUR_UNSPLASH_ACCESS_KEY"
    ```
    *Note: The Ballerina service also requires configuration for database and email credentials. This is typically managed in a `Config.toml` file within the Ballerina project.*

3.  **Database Setup (MongoDB)**
    * Start your MongoDB server.
    * Connect to it using `mongosh` or a GUI like MongoDB Compass.
    * Create a new database named **`userDb`**.
    * Inside `userDb`, create the following collections:
        * `Trending`
        * `admin`
        * `adminMessages`
        * `notificationCounter`
        * `notifications`
        * `presentations`
        * `userData`
        * `users`

4.  **Backend Setup (Python - AI Engine)**
    * Navigate to the Python backend directory.
        ```sh
        cd Backend/Python
        ```
    * Create and activate a virtual environment.
        ```sh
        # For Windows
        python -m venv .venv
        .\.venv\Scripts\activate

        # For macOS/Linux
        python3 -m venv .venv
        source .venv/bin/activate
        ```
    * Install the required packages.
        ```sh
        pip install -r requirements.txt
        ```
    * Run the Flask server (typically on port 5001).
        ```sh
        flask run --port=5001
        ```
        Keep this terminal running.

5.  **Backend Setup (Ballerina - Core Service)**
    * Open a **new terminal**.
    * Navigate to the Ballerina backend directory.
        ```sh
        cd Backend/Ballerina_backend
        ```
    * Run the Ballerina service using the CLI (typically on port 9090).
        ```sh
        bal run
        ```
        Keep this terminal running.

6.  **Frontend Setup (React)**
    * Open a **third terminal**.
    * Navigate to the root directory of the project.
    * Install the required npm packages.
        ```sh
        npm install
        ```
    * Start the React development server (typically on port 3000).
        ```sh
        npm start
        ```

You should now have all three services (React, Python, Ballerina) and the database running! Open your browser to `http://localhost:3000` to see the application.


