 **🌍 AI-Powered Iteration Generator (MERN Stack) 🚀**  

## **📖 About**  
This project is an **AI-powered travel planner** built using the **MERN (MongoDB, Express, React, Node.js) stack**. It helps users create, customize, and manage their itineraries with features such as:  
- **User Authentication** (JWT-based login/signup)  
- **Real-time Weather Data** (via OpenWeather API)  
- **AI-Powered Suggestions** (via Gemini API)  
- **MongoDB Database Integration**  

---

## **🚀 Installation & Setup**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/SivaSabariGanesan/AI-Powered-Iteration-Generator.git
cd AI-Powered-Iteration-Generator
```

### **2️⃣ Install Dependencies**  
#### **Backend**  
```sh
cd backend
npm install
```

#### **Frontend**  
```sh
cd ../frontend
npm install
```

### **3️⃣ Create a `.env` File**  
Create a `.env` file in the **backend** directory and add the following:  
```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-planner
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@example.com
EMAIL_APP_PASSWORD=your_email_app_password
JWT_SECRET=your_secure_jwt_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key
```
⚠️ **Important:** Never share or commit your `.env` file to GitHub.  

### **4️⃣ Start the Project**  
#### **Backend**  
```sh
cd backend
npm run dev  # For development (using nodemon)
npm start    # For production
```

#### **Frontend**  
```sh
cd ../frontend
npm start
```

---

## **🌟 Features**  
✅ MERN Stack (MongoDB, Express, React, Node.js)  
✅ Secure Authentication (JWT-based)  
✅ AI-based trip recommendations  
✅ MongoDB for itinerary storage  
✅ Weather updates for destinations  

---

## **🔧 API Endpoints**  
| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| POST   | `/auth/register`    | Register a new user  |
| POST   | `/auth/login`       | Login user           |
| GET    | `/trips`            | Fetch user trips     |
| POST   | `/trips/create`     | Create a new trip    |

---

## **📜 License**  
This project is licensed under the **MIT License**.  
