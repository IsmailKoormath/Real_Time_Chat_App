"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/app/providers/AuthContext";
import Link from "next/link";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(credentials);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#e5ddd5]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-[#075e54]">
          Register
        </h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 my-2 text-black bg-[#f0f0f0] border border-gray-300 rounded"
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 my-2  text-black bg-[#f0f0f0] border border-gray-300 rounded"
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 my-2  text-black bg-[#f0f0f0] border border-gray-300 rounded"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="w-full bg-[#25D366] text-white p-2 rounded mt-4 hover:bg-[#1ebe57] transition"
        >
          Register
        </button>
        <p className="text-center text-gray-700 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-[#075e54] hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
