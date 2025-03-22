import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import ItineraryGenerator from "./components/ItineraryGenerator";
import SavedItineraries from "./components/SavedItineraries";
import Navbar from "./components/Navbar";
import ItineraryDetails from "./components/ItineraryDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Toaster position="top-center" expand={true} richColors />
      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={isAuthenticated ? <ItineraryGenerator /> : <Navigate to="/login" />} />
          <Route path="/saved" element={isAuthenticated ? <SavedItineraries /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/itinerary/:id" element={isAuthenticated ? <ItineraryDetails /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;