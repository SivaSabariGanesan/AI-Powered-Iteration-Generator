import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import api from "../utils/axios";

const ItineraryDetails: React.FC = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    setLoading(true);
    api.get(`/itinerary/${id}`)
      .then((response) => {
        setItinerary(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching itinerary details:", error);
        setLoading(false);
      });
  }, [id]);

  const formatDayWiseItinerary = (text: string) => {
    const days: { title: string; activities: string[] }[] = [];
    let currentDay: { title: string; activities: string[] } | null = null;

    // Split text into lines and clean up
    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/[*]/g, "").trim()); // Remove asterisks

    lines.forEach((line) => {
      // Match any variation of "Day X" at the start of the line
      const dayMatch = line.match(/^(?:Day|DAY|day)\s*(\d+)(?::|\.|\s|$)/i);
      
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          title: `Day ${dayMatch[1]}`,
          activities: [],
        };
      } else if (currentDay) {
        // Clean up the activity text
        const activity = line
          .replace(/^[-•]\s*/, "") // Remove bullet points
          .replace(/^\d+\.\s*/, "") // Remove numbered lists
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

  const extractBudgetItems = (budget: string | number) => {
    const totalBudget = typeof budget === "number" 
      ? budget 
      : Number.parseInt(budget.replace(/[^\d]/g, "")) || 1000;

    return [
      { category: "Transportation", cost: Math.round(totalBudget * 0.3) },
      { category: "Accommodation", cost: Math.round(totalBudget * 0.4) },
      { category: "Food & Dining", cost: Math.round(totalBudget * 0.2) },
      { category: "Activities & Sightseeing", cost: Math.round(totalBudget * 0.1) },
    ];
  };

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-center text-lg font-semibold text-red-500">
          Failed to load itinerary.
        </p>
      </div>
    );
  }

  const days = formatDayWiseItinerary(itinerary.itineraryText);
  const budgetItems = extractBudgetItems(itinerary.budget);
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {itinerary.destination}
        </h1>
        <div className="flex justify-center items-center gap-4">
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
            {itinerary.days} {itinerary.days === 1 ? "day" : "days"}
          </span>
          <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            ₹{typeof itinerary.budget === "number"
              ? itinerary.budget.toLocaleString("en-IN")
              : itinerary.budget}
          </span>
        </div>
      </div>

      {/* Weather Overview */}
      {itinerary.weatherData && itinerary.weatherData.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Weather Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {itinerary.weatherData.map((weather: any, index: number) => (
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

      {/* Interests */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">
          Travel Interests
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {itinerary.interests}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === "details"
                ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Day-wise Itinerary
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === "budget"
                ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("budget")}
          >
            Budget Breakdown
          </button>
        </div>

        <div className="mt-6">
          {/* Day-wise Itinerary Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {days.map((day, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-4 text-indigo-600">
                    {day.title}
                  </h3>
                  <div className="space-y-3">
                    {day.activities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 text-gray-700">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                          {i + 1}
                        </div>
                        <p className="pt-0.5">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === "budget" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        Estimated Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {budgetItems.map((item, index) => (
                      <tr key={index} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-right">
                          ₹{item.cost.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Total Budget
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        ₹{totalBudget.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Budget Notes
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    Costs are approximate and may vary based on season and availability
                  </li>
                  <li className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    Budget excludes shopping and personal expenses
                  </li>
                  <li className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    Consider keeping a buffer of 10-15% for unexpected expenses
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <button className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200">
          Book This Itinerary
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Prices and availability subject to change
        </p>
      </div>
    </div>
  );
};

export default ItineraryDetails;