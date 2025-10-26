"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // list of { id, course: {id,title,price...}, added_at }
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);

  // load from localStorage first
  useEffect(() => {
    const local = typeof window !== "undefined" && localStorage.getItem("cart");
    if (local) {
      try { setCart(JSON.parse(local)); } catch { setCart([]); }
    }
    // then attempt to sync with server if user logged in
    (async () => {
      const access = typeof window !== "undefined" && localStorage.getItem("access");
      if (access) {
        setLoading(true);
        try {
          const serverItems = await apiGet("/cart/");
          setCart(serverItems);
          setSynced(true);
        } catch (err) {
          // keep local if server fails
          console.error("Cart sync failed:", err);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, []);

  
  // persist to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // add to cart (will try server if logged in)
  const addToCart = async (course) => {
    const access = typeof window !== "undefined" && localStorage.getItem("access");
    if (access) {
      try {
        const payload = { course_id: course.id };
        const res = await apiPost("/cart/", payload);
        // server returns CartItem with course nested
        // ensure we don't duplicate in local state
        setCart((prev) => {
          const exists = prev.find((it) => it.course?.id === course.id || it.course_id === course.id || it.id === res.id);
          if (exists) return prev;
          return [...prev, res];
        });
        return { ok: true, source: "server" };
      } catch (err) {
        console.error(err);
        return { ok: false, error: err.message };
      }
    } else {
      // local only
      setCart((prev) => {
        const exists = prev.find((it) => (it.course && it.course.id === course.id) || it.course_id === course.id);
        if (exists) return prev;
        const item = { id: `local-${course.id}`, course, added_at: new Date().toISOString() };
        return [...prev, item];
      });
      return { ok: true, source: "local" };
    }
  };

  const removeFromCart = async (courseId) => {
    const access = typeof window !== "undefined" && localStorage.getItem("access");
    if (access) {
      try {
        await apiDelete(`/cart/remove/${courseId}/`);
        setCart((prev) => prev.filter((it) => !(it.course?.id === courseId || it.course_id === Number(courseId))));
        return { ok: true };
      } catch (err) {
        console.error(err);
        return { ok: false, error: err.message };
      }
    } else {
      setCart((prev) => prev.filter((it) => !(it.course?.id === courseId || it.course_id === Number(courseId))));
      return { ok: true };
    }
  };

  const clearCart = async () => {
    const access = typeof window !== "undefined" && localStorage.getItem("access");
    if (access) {
      try {
        await apiPost("/cart/clear/", {});
        setCart([]);
        return { ok: true };
      } catch (err) {
        console.error(err);
        return { ok: false, error: err.message };
      }
    } else {
      setCart([]);
      return { ok: true };
    }
  };

  // expose API
  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, synced }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
