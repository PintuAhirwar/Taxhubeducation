"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Modal from "@/components/Modal";
import Image from "next/image";
import { getImagePrefix } from "@/utils/util";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";
import { API_BASE } from "@/lib/api";

export default function CartPage() {
  const { cart, loading, removeFromCart, clearCart } = useCart();

  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/Cart", text: "Cart" },
  ];

  const total = cart.reduce((sum, item) => {
    const price = item.course?.price ?? item.price ?? 0;
    return sum + Number(price);
  }, 0);

  const handleRemove = (c) => {
    removeFromCart(c.id);
    toast.info(`${c.title} removed from cart`);
  };

  if (loading) return <div>Loading cart...</div>;
  if (!cart || cart.length === 0)
    return (
      <div className="p-6 text-center text-xl">Your cart is empty 🛒</div>
    );

  // -------------------- MODAL STATES --------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [voucherStatus, setVoucherStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    voucher: "",
  });

  // -------------------- HANDLE INPUTS --------------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // -------------------- APPLY VOUCHER --------------------
  const handleVoucherApply = async () => {
    try {
      const res = await axios.post(`${API_BASE}/vouchers/validate/`, {
        code: formData.voucher,
        course_id: cart[0]?.course?.id || cart[0]?.id, // assuming 1 course per order
      });
      setDiscount(res.data.discount_amount);
      setVoucherStatus("applied");
      toast.success("🎟 Voucher applied successfully!");
    } catch (err) {
      setVoucherStatus("invalid");
      setDiscount(0);
      toast.error(err.response?.data?.error || "Invalid voucher");
    }
  };

  // -------------------- HANDLE CHECKOUT --------------------
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (step === 1) return setStep(2);

    const token = localStorage.getItem("access");
    const finalAmount = total - discount;

    try {
      await axios.post(
        `${API_BASE}/api/orders/`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          discount_code: formData.voucher,
          discount_amount: discount,
          total_amount: total,
          final_amount: finalAmount,
          items: cart.map((c) => ({
            course: c.course?.id || c.id,
            price: c.course?.price || c.price,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Order placed successfully!");
      clearCart();
      setIsModalOpen(false);
      setStep(1);
      setDiscount(0);
      setVoucherStatus("");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to place order");
    }
  };

  // -------------------- MAIN RETURN --------------------
  return (
    <section id="cart">
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="p-6">
          <Breadcrumb links={breadcrumbLinks} />

          <div className="sm:flex justify-between items-center mb-12">
            <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold">
              My Cart
            </h2>
          </div>

          {/* Cart grid */}
          <div className="grid grid-cols-3 gap-6">
            {cart.map((it) => {
              const c = it.course || it;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl shadow-course-shadow overflow-hidden"
                >
                  <div className="relative w-full h-[200px]">
                    <Image
                      src={
                        c.image?.startsWith("http")
                          ? c.image
                          : `${getImagePrefix()}${c.image}`
                      }
                      alt={c.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="text-2xl font-bold text-black">{c.title}</h2>
                    <p className="text-black/75 mt-1">{c.faculty}</p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-2xl font-semibold">₹{c.price}</div>
                      <button
                        onClick={() => handleRemove(c)}
                        className="bg-primary text-white hover:bg-primary/15 hover:text-primary px-8 py-3 rounded-full text-lg font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total & Checkout */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-3xl font-semibold">Total: ₹{total}</div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="bg-primary/15 text-primary hover:bg-primary hover:text-white px-16 py-5 rounded-full text-lg font-medium"
              >
                Clear
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white hover:bg-primary/15 hover:text-primary px-16 py-5 rounded-full text-lg font-medium"
              >
                Checkout
              </button>
            </div>
          </div>

          {/* Checkout Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Your Details</h2>
                <form onSubmit={handleCheckout} className="space-y-4">
                  {["name", "email", "phone", "address"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      onChange={handleChange}
                      value={formData[field]}
                      required
                      className="w-full border p-3 rounded-xl"
                    />
                  ))}

                  <div className="flex gap-2 items-center">
                    <input
                      name="voucher"
                      placeholder="Discount Code"
                      onChange={handleChange}
                      value={formData.voucher}
                      className="border p-3 rounded-xl flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleVoucherApply}
                      className={`px-4 rounded-xl text-white ${
                        voucherStatus === "applied"
                          ? "bg-green-500"
                          : voucherStatus === "invalid"
                          ? "bg-red-500"
                          : "bg-primary"
                      }`}
                    >
                      {voucherStatus === "applied"
                        ? "Applied ✅"
                        : voucherStatus === "invalid"
                        ? "Invalid ❌"
                        : "Apply"}
                    </button>
                  </div>

                  <button className="w-full bg-primary text-white py-3 rounded-full text-lg">
                    Next → Payment
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Payment</h2>
                <div className="space-y-2 text-lg">
                  <p>Total: ₹{total}</p>
                  <p>Discount: ₹{discount}</p>
                  <p className="font-bold">Final Payable: ₹{total - discount}</p>
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-gray-200 py-3 rounded-full text-lg"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-1/2 bg-primary text-white py-3 rounded-full text-lg"
                  >
                    Pay & Place Order
                  </button>
                </div>
              </>
            )}
          </Modal>
        </div>
      </div>
    </section>
  );
}
