import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import api from "../utils/axios";

const ItineraryGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [budget, setBudget] = useState<number | "">("");
  const [interests, setInterests] = useState<string>("");
  const [days, setDays] = useState<number | "">(1);
  const [people, setPeople] = useState<number | "">(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [generatedItinerary, setGeneratedItinerary] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) {
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    } else if (desc.includes('cloud')) {
      return <Cloud className="w-6 h-6 text-gray-500" />;
    } else {
      return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const formatItineraryByDays = (text: string): { day: string; activities: string[] }[] => {
    const days: { day: string; activities: string[] }[] = [];
    let currentDay: { day: string; activities: string[] } | null = null;

    text.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Check for day headers (Day X, DAY X, etc.)
      const dayMatch = trimmedLine.match(/^(?:Day|DAY|day)\s*(\d+)(?::|\.|\s|$)/i);
      
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          day: `Day ${dayMatch[1]}`,
          activities: [],
        };
      } else if (currentDay) {
        // Clean up the activity text
        const activity = trimmedLine
          .replace(/^[-•]\s*/, '') // Remove bullet points
          .replace(/^\d+\.\s*/, '') // Remove numbered lists
          .trim();
        
        if (activity) {
          currentDay.activities.push(activity);
        }
      }
    });

    if (currentDay && currentDay.activities.length > 0) {
      days.push(currentDay);
    }

    return days;
  };

  const handleGenerateItinerary = async () => {
    if (!from || !destination || !budget || !interests || isNaN(Number(days)) || Number(days) < 1 || !startDate || !endDate) {
      toast.error("Please fill all fields correctly!");
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("Start date cannot be in the past!");
      return;
    }

    if (end <= start) {
      toast.error("End date must be after start date!");
      return;
    }

    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff !== Number(days)) {
      toast.error(`Number of days (${days}) doesn't match the selected dates (${daysDiff} days)`);
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.post("/generate-itinerary", {
        from,
        destination,
        budget,
        interests,
        days,
        people,
        startDate,
        endDate
      });

      const { itineraryText, weatherData: newWeatherData } = response.data;
      setGeneratedItinerary(itineraryText);
      setWeatherData(newWeatherData || []);
      
      toast.success("Your itinerary has been generated and saved!");
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
      toast.error(error.response?.data?.error || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const formattedDays = generatedItinerary ? formatItineraryByDays(generatedItinerary) : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Plan Your Trip</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">From:</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter starting location"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Destination:</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter destination"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Budget (₹):</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value) || "")}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter budget"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && new Date(e.target.value) > new Date(endDate)) {
                    setEndDate(e.target.value);
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Interests:</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Beaches, Hiking, Museums"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Number of Days:</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value) || "")}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Number of People:</label>
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(Number(e.target.value) || "")}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateItinerary}
          disabled={loading}
          className={`w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg font-medium
            hover:from-indigo-700 hover:to-purple-700 transition-all duration-200
            ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </div>

      {generatedItinerary && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-center">Your Travel Itinerary</h3>
          
          {/* Weather Overview */}
          {weatherData.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4">Weather Forecast</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {weatherData.map((weather, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(weather.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      {getWeatherIcon(weather.description)}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <span className="font-semibold">{weather.temperature}°C</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 capitalize">{weather.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {formattedDays.map((day, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-indigo-600 mb-3">{day.day}</h4>
                <ul className="space-y-2">
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                        {actIndex + 1}
                      </span>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/saved')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              View Saved Itineraries
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryGenerator;