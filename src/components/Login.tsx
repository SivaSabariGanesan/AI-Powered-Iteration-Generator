import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "../utils/axios";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-center text-3xl font-bold text-indigo-600">
          Welcome back!
        </h2>
        <p className="text-center text-sm text-gray-500">
          Plan your next adventure
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
