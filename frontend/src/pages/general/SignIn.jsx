import React, { useState } from "react";
import axios from "axios";
import { GraduationCap, Lock, Mail, UserCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEMO_CREDENTIALS = {
  admin:       { email: "admin2",               password: "123456",  role: "admin" },
  teacher:     { email: "2004005@teacher.com",  password: "2004005", role: "teacher" },
  coordinator: { email: "200400@coordinator.com", password: "200400", role: "coordinator" },
};

function SignIn() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [demoActive, setDemoActive] = useState(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDemoLogin = (demoRole) => {
    const creds = DEMO_CREDENTIALS[demoRole];
    setRole(creds.role);
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
    setDemoActive(demoRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/api/v1/users/login`, {
        username: email,
        password: password,
        role: role,
      });

      console.log("Login successful:", response.data);

      if (role === "coordinator") navigate("/coordinator");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
      else console.log("Role not recognized for navigation:", role);
    } catch (error) {
      console.error("Error logging in:", error);
      if (role === "") setError("Login failed. Please select a role.");
      else setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center">
          <GraduationCap className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">Welcome to CUET Routine</h2>
        <p className="text-gray-600">Chittagong University of Engineering & Technology</p>
      </div>

      <div className="max-w-md w-full mx-auto px-4">
        {/* Demo Login Banner */}
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Try a Demo Account</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "admin",       label: "Admin" },
              { key: "teacher",     label: "Teacher" },
              { key: "coordinator", label: "Coordinator" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleDemoLogin(key)}
                className={`py-1.5 px-2 rounded-md text-xs font-medium border transition-all ${
                  demoActive === key
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {demoActive && (
            <p className="mt-2 text-xs text-amber-700">
              ✓ Demo credentials filled — click <strong>Sign In</strong> to continue.
            </p>
          )}
        </div>

        {/* Sign In Form */}
        <div className="bg-white shadow-lg rounded-lg p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3">
              <RoleButton
                active={role === "admin"}
                onClick={() => { setRole("admin"); setDemoActive(null); }}
                icon={<UserCircle className="h-5 w-5" />}
                label="Admin"
              />
              <RoleButton
                active={role === "coordinator"}
                onClick={() => { setRole("coordinator"); setDemoActive(null); }}
                icon={<UserCircle className="h-5 w-5" />}
                label="Course Coordinator"
              />
              <RoleButton
                active={role === "teacher"}
                onClick={() => { setRole("teacher"); setDemoActive(null); }}
                icon={<UserCircle className="h-5 w-5" />}
                label="Teacher"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setDemoActive(null); }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@cuet.ac.bd"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  onChange={(e) => { setPassword(e.target.value); setDemoActive(null); }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
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