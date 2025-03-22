import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const SavedItineraries: React.FC = () => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = () => {
    api.get("/saved-itineraries")
      .then((response) => setItineraries(response.data))
      .catch((error) => console.error("Error fetching saved itineraries:", error));
  };

  const handleDelete = (id: string) => {
    api.delete(`/saved-itineraries/${id}`)
      .then(() => {
        setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          console.error("Itinerary not found. It may have been deleted already.");
        } else {
          console.error("Error deleting itinerary:", error);
        }
      });
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Saved Itineraries</h2>
      {itineraries.length === 0 ? (
        <p>No itineraries saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {itineraries.map((itinerary) => (
            <div 
              key={itinerary._id} 
              className="p-4 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <h3 className="font-semibold text-lg" onClick={() => navigate(`/itinerary/${itinerary._id}`)}>{itinerary.destination}</h3>
              <p>{itinerary.days} days</p>
              <button 
                className="mt-2 bg-red-500 text-white hover:bg-red-600 p-2 rounded" 
                onClick={() => handleDelete(itinerary._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItineraries;