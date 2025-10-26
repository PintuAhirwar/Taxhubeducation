"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios
      .get(`${API_BASE}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.map((o) => (
        <div key={o.id} className="border p-4 rounded-xl mb-4">
          <h2 className="text-xl font-semibold mb-2">Order #{o.id}</h2>
          <p>Total: ₹{o.final_amount}</p>
          <p>Status: {o.payment_status}</p>
          <p>Date: {new Date(o.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
