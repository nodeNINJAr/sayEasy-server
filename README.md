

# **SayEasy – Server** 🎓  

This is the **backend server** for **SayEasy**, an online tutor booking platform that connects language learners with skilled tutors. The server is built using **Node.js** and **Express**, with **MongoDB** as the database.  

## 🚀 Features  

✅ **User Authentication** – Secure login & signup with **JWT-based authentication**.  
✅ **Tutor & Student Management** – Handle **user roles** and **permissions**.  
✅ **Booking System** – Manage tutor **appointments and reviews**.  
✅ **Database Management** – Uses **MongoDB** for storing user data, bookings, and tutorials.  
✅ **Secure API Communication** – Implements **CORS, Cookie-Parser, and Environment Variables**.  

---

## 📑 Table of Contents  

- [**SayEasy – Server** 🎓](#sayeasy--server-)
  - [🚀 Features](#-features)
  - [📑 Table of Contents](#-table-of-contents)
  - [🛠 Tech Stack](#-tech-stack)
  - [📥 Installation](#-installation)
    - [**Prerequisites**](#prerequisites)
    - [**Steps**](#steps)
  - [▶️ Usage](#️-usage)
  - [📜 Available Scripts](#-available-scripts)
  - [⚙️ Environment Variables](#️-environment-variables)
    - [**MongoDB Connection**](#mongodb-connection)
  - [🔗 API Endpoints](#-api-endpoints)
    - [**Tutor \& Student Management**](#tutor--student-management)
    - [**Booking System**](#booking-system)
    - [**Community System**](#community-system)
  - [🛠 Troubleshooting](#-troubleshooting)
  - [🤝 Contributing](#-contributing)

---

## 🛠 Tech Stack  

| Technology  | Purpose |
|-------------|---------|
| **Node.js** | JavaScript Runtime |
| **Express.js** | Web Framework |
| **MongoDB** | NoSQL Database |
| **JWT (jsonwebtoken)** | Authentication |
| **Dotenv** | Environment Variables |
| **Cors** | Cross-Origin Resource Sharing |
| **Cookie-Parser** | Secure User Authentication |

---

## 📥 Installation  

### **Prerequisites**  

- **Node.js (>=16.0.0)**  
- **MongoDB Atlas or Local MongoDB Instance**  

### **Steps**  

1. Clone the repository:  
   ```sh
   git clone https://github.com/nodeNINJAr/sayEasy-server
   cd sayeasy-server
   ```  
2. Install dependencies:  
   ```sh
   npm install
   ```  
3. Create a `.env` file and configure the environment variables (see [Environment Variables](#-environment-variables)).  
4. Start the development server:  
   ```sh
   npm start
   ```  

---

## ▶️ Usage  

- **Start the production server:**  
  ```sh
  npm start
  ```  
- **Run tests:**  
  ```sh
  npm test
  ```  

---

## 📜 Available Scripts  

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm test` | Run tests |

---

## ⚙️ Environment Variables  

Create a `.env` file in the root directory and configure the following:  

```env
PORT=5000

# MongoDB Connection
DB_USER=your-db-username
DB_PASS=your-db-password
MONGODB_URI=mongodb+srv://$(DB_USER):$(DB_PASS)@cluster.mongodb.net/sayeasy?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-secret-key
```

### **MongoDB Connection**  

Ensure your **MongoDB URI** is correctly configured in your `.env` file.  
For local MongoDB, use:  
```env
MONGODB_URI=mongodb://localhost:27017/sayeasy
```

For **MongoDB Atlas**, replace it with your cloud connection string.

---

## 🔗 API Endpoints  


### **Tutor & Student Management**  

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tutorials` | Get all tutors tutorials|
| `POST` | `/api/add-tutorials` | Add a new tutor tuturials |
| `PUT` | `/api/update-tutorials/:id` | Update tutor tutorial details |
| `DELETE` | `/api/remove/:id` | Remove a tutor tutorial |

### **Booking System**  

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tutor-booking` | Book a tutor |
| `GET` | `/api/booked-tutors/:email` | Get all bookings for a user |
| `POST` | `/api/reviews` | Add a review for a tutor |

### **Community System**  

`GET` | `/api/communityPosts` | Get all comminity post |

For full API documentation, refer to `api-docs.md` (if available).

---

## 🛠 Troubleshooting  

- **Server Not Starting?**  
  Ensure **MongoDB** is running and your `.env` variables are set up correctly.  

- **CORS Issues?**  
  Update your `cors` configuration in `index.js`:  
  ```js
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
  ```  

- **Invalid JWT Token?**  
  - Make sure the token is correctly passed in the Authorization header.  
  - Check if `JWT_SECRET` is correctly set in `.env`.  

---

## 🤝 Contributing  

We welcome contributions! Follow these steps:  

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature-branch`)  
3. Commit your changes (`git commit -m "Add new feature"`)  
4. Push to the branch (`git push origin feature-branch`)  
5. Open a Pull Request  

