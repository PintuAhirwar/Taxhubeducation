"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SocialSignIn from "../SocialSignIn";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isRegister && !otpSent) {
        // Step 1: Register and send OTP
        const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setOtpSent(true);
          setMessage("OTP sent to your email!");
        } else {
          setMessage(data.error || JSON.stringify(data));
        }
      } else if (isRegister && otpSent) {
        // Step 2: Verify OTP
        const res = await fetch("http://127.0.0.1:8000/api/auth/verify-otp/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp: formData.otp }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          router.push("home");   // Next.js SPA navigation
        } else {
          setMessage(data.error || JSON.stringify(data));
        }
      } else {
        // Step 3: Login
        const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          window.location.href = "/";   // Next.js SPA navigation
        } else {
          setMessage(data.error || JSON.stringify(data));
        }
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      {/* Social Sign In */}
      <SocialSignIn />

      {/* OR Divider */}
      <span className="z-1 relative my-8 block text-center before:content-[''] before:absolute before:h-px before:w-[40%] before:bg-black/15 before:left-0 before:top-3 after:content-[''] after:absolute after:h-px after:w-[40%] after:bg-black/15 after:top-3 after:right-0">
        <span className="text-black relative z-10 inline-block px-3 text-base">
          OR
        </span>
      </span>

      <h1 className="text-2xl font-bold mb-4 text-center">
        {isRegister ? "Create Account" : "Welcome Back"}
      </h1>
      <p className="text-center mt-3 text-green-400">{message}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegister && !otpSent && (
          <div className="mb-[22px]">
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="w-full rounded-md border border-black/20 px-5 py-3 text-base text-black bg-transparent outline-none"
              onChange={handleChange}
              required
            />
          </div>
        )}
        {isRegister && !otpSent && (
          <div className="mb-[22px]">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="w-full rounded-md border border-black/20 px-5 py-3 text-base text-black bg-transparent outline-none"
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="mb-[22px]">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-md border border-black/20 px-5 py-3 text-base text-black bg-transparent outline-none"
            onChange={handleChange}
            required
          />
        </div>


        {!otpSent && (
          <div className="mb-[22px]">
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="w-full rounded-md border border-black/20 px-5 py-3 text-base text-black bg-transparent outline-none"
              onChange={handleChange}
              required
            />
          </div>
        )}

        {isRegister && otpSent && (
          <div className="mb-[22px]">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="w-full p-2 mb-3 rounded bg-gray-700"
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-white font-medium border border-primary hover:bg-transparent hover:text-primary"
          >
            {isRegister
              ? (otpSent
                ? "Verify OTP"
                : "Register & Get OTP")
              : "Login"}
          </button>

          <p className="text-center mt-3 text-sm">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => {
                    setIsRegister(false);
                    setOtpSent(false);
                  }}
                >
                  Sign In
                </span>
              </>
            ) : (
              <>
                New here?{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => setIsRegister(true)}
                >
                  Register
                </span>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};
