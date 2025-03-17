"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/app/providers/AuthContext";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(credentials);
    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#e5ddd5] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              type="text"
              placeholder="Username"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>
          <button
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition duration-200"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
