"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/app/providers/AuthContext";
import Link from "next/link";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#e5ddd5] text-black">
      <form
        className="bg-white p-6 rounded-lg w-96 shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 text-[#075e54]">Login</h2>
        <input
          className="w-full p-2 mb-3 bg-[#f0f0f0] border border-gray-300 rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 mb-3 bg-[#f0f0f0] border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-[#25D366] p-2 text-white rounded hover:bg-[#1ebe57]"
          type="submit"
        >
          Login
        </button>

        <p className="text-center mt-3 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#075e54] font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
