import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Phone, MapPin, Heart } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    phone: '',
    address: '',
    preferences: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const preferences = e.target.value.split(',').map((pref) => pref.trim());
    setProfile((prev) => ({ ...prev, preferences }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/profile',
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="pl-12 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="pl-12 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Preferences
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="preferences"
                  value={profile.preferences.join(', ')}
                  onChange={handlePreferenceChange}
                  className="pl-12 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Adventure, Culture, Food (comma-separated)"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;