"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumb";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    profile_pic: null,
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [token, setToken] = useState(null); // ← client-safe token

  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/profile", text: "Profile" },
  ];

  // Set token on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access");
      setToken(storedToken);
    }
  }, []);

  // Fetch user profile once token is available
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormData(res.data);
        setPreview(res.data.profile_pic);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setLoading(false);
      });
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "profile_pic") {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_pic: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!token) return alert("You must be logged in");

  const formDataToSend = new FormData();
  formDataToSend.append("phone", formData.phone || "");
  formDataToSend.append("bio", formData.bio || "");
  formDataToSend.append("address", formData.address || "");
  formDataToSend.append("dob", formData.dob || "");

  if (formData.profile_pic && formData.profile_pic instanceof File) {
    formDataToSend.append("profile_pic", formData.profile_pic);
  }

  // Debug
  for (let pair of formDataToSend.entries()) {
    console.log(pair[0]+ ': '+ pair[1]);
  }

  try {
    await axios.put("http://127.0.0.1:8000/api/auth/profile/", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    alert("✅ Profile updated successfully!");
  } catch (error) {
    console.error("Profile update error:", error.response?.data || error);
    alert("❌ Error updating profile");
  }
};

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <section id="profile">
      <div className="max-w-3xl mx-auto p-6">
        {/* Breadcrumb */}
        <Breadcrumb links={breadcrumbLinks} />

        <h1 className="text-4xl font-bold text-midnight_text mb-8 text-center">My Profile</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-course-shadow rounded-2xl p-6"
        >
          {/* Profile Picture & Name */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full border-2 border-gray-200 object-cover"
            />
            <label className="cursor-pointer text-primary hover:underline">
              Edit Photo
              <input
                type="file"
                name="profile_pic"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            <h2 className="text-2xl font-semibold">{formData.name}</h2>
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full border border-gray-300 p-3 rounded-xl bg-gray-100 cursor-not-allowed text-black/80"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border border-gray-300 p-3 rounded-xl bg-gray-100 cursor-not-allowed text-black/80"
            />
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            />
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            />
          </div>

          <textarea
            name="bio"
            placeholder="Short Bio"
            value={formData.bio || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          />

          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-16 py-5 rounded-full text-lg font-medium"
          >
            Save Profile
          </button>
        </form>
      </div>
    </section>
  );
}
