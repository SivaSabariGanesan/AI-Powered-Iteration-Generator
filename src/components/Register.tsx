import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import api from "../utils/axios";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-center text-3xl font-bold text-indigo-600">
          Create your account
        </h2>
        <p className="text-center text-sm text-gray-500">
          Start planning your dream trips
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-10 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-10 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-10 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
