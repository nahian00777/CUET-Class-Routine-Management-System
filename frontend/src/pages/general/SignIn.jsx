import React, { useState } from "react";
import { GraduationCap, Lock, Mail, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function SignIn() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    return password.length >= minLength && hasUpperCase;
  };
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter."
      );
      return;
    }

    if (role === "coordinator") {
      navigate("/coordinator"); // Navigate to CoordinatorPage if the coordinator role is selected
    } 
    else if (role === "teacher") {
      navigate("/teacher"); // Navigate to TeacherPage if the teacher role is selected
    } else {
      console.log("Role not recognized for navigation:", role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center">
          <GraduationCap className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Welcome to CUET Routine
        </h2>
        <p className="text-gray-600">
          Chittagong University of Engineering & Technology
        </p>
      </div>

      {/* Sign In Form */}
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3">
              <RoleButton
                active={role === "admin"}
                onClick={() => setRole("admin")}
                icon={<UserCircle className="h-5 w-5" />}
                label="Admin"
              />
              <RoleButton
                active={role === "coordinator"}
                onClick={() => setRole("coordinator")}
                icon={<UserCircle className="h-5 w-5" />}
                label="Course Coordinator"
              />
              <RoleButton
                active={role === "teacher"}
                onClick={() => setRole("teacher")}
                icon={<UserCircle className="h-5 w-5" />}
                label="Teacher"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@cuet.ac.bd"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Reserved Space for Error Message */}
            <div className="h-6 text-center">
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
            
            {/* Forgot Password Link */}
            <div className="text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Need help? Contact CUET IT Support
      </div>
    </div>
  );
}

// Role Button Component
function RoleButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 border rounded-md ${
        active
          ? "bg-blue-50 border-blue-600 text-blue-600"
          : "border-gray-300 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="mt-1 text-xs font-medium">{label}</span>
    </button>
  );
}

export default SignIn;