import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import authRoutes from "./auth.js";
import jwt from "jsonwebtoken";
import { format, addDays } from 'date-fns';

// Load environment variables
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Itinerary Schema
const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from: { type: String, required: true },
  destination: { type: String, required: true },
  budget: { type: String, required: true },
  interests: { type: String, required: true },
  days: { type: Number, required: true },
  people: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  itineraryText: String,
  weatherData: [{
    date: Date,
    temperature: Number,
    description: String,
    icon: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Fetch weather data for a location and date range
async function getWeatherData(location, startDate, endDate) {
  try {
    if (!process.env.OPENWEATHER_API_KEY) {
      console.error('OpenWeather API key not found');
      return [];
    }

    // Get coordinates for the location
    const geocodeResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!geocodeResponse.data.length) {
      console.error('Location not found:', location);
      return [];
    }

    const { lat, lon } = geocodeResponse.data[0];

    // Fetch weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    
    // Create an array of dates between start and end
    for (let dt = start; dt <= end; dt = addDays(dt, 1)) {
      days.push(format(dt, 'yyyy-MM-dd'));
    }

    // Process weather data for each day
    const dailyWeather = days.map(day => {
      // Find weather data for this day (using noon as reference time)
      const dayData = weatherResponse.data.list.find(item => {
        const itemDate = new Date(item.dt * 1000);
        return format(itemDate, 'yyyy-MM-dd') === day;
      });

      if (!dayData) return null;

      return {
        date: new Date(day),
        temperature: Math.round(dayData.main.temp),
        description: dayData.weather[0].description,
        icon: dayData.weather[0].icon
      };
    }).filter(Boolean);

    return dailyWeather;
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    return [];
  }
}

// Protected routes
app.post("/generate-itinerary", authenticateToken, async (req, res) => {
  try {
    const { from, destination, budget, interests, days, people, startDate, endDate } = req.body;

    if (!from || !destination || !budget || !interests || !days || !people || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Fetch weather data
    const weatherData = await getWeatherData(destination, startDate, endDate);
    console.log('Weather data fetched:', weatherData); // Debug log

    const prompt = `Plan a ${days}-day trip from ${from} to ${destination} from ${formattedStartDate} to ${formattedEndDate} with a budget of ${budget} for ${people} people. Include places based on these interests: ${interests}. Format the response with clear day headers (Day 1, Day 2, etc.) and bullet points for activities.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const itineraryText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No itinerary generated.";

    // Auto-save the generated itinerary with weather data
    const newItinerary = new Itinerary({
      userId: req.user.userId,
      from,
      destination,
      budget,
      interests,
      days,
      people,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      itineraryText,
      weatherData
    });
    await newItinerary.save();

    res.json({ 
      itineraryText, 
      weatherData, 
      _id: newItinerary._id 
    });
  } catch (error) {
    console.error("❌ AI Error:", error?.response?.data || error?.message || error);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

app.get("/saved-itineraries", authenticateToken, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

app.get("/itinerary/:id", authenticateToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});

app.delete("/saved-itineraries/:id", authenticateToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});