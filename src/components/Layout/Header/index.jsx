"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerData } from "./Navigation/menuData";
import Logo from "./Logo";
import HeaderLink from "./Navigation/HeaderLink";
import MobileHeaderLink from "./Navigation/MobileHeaderLink";
import Signin from "@/components/Auth/SignIn";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import ProfileDropdown from "@/components/Layout/Header/ProfileDropdown";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { use } from "react";
import { useCart } from "@/context/CartContext";
import { API_BASE } from "@/lib/api";

export default function Header() {
  const pathUrl = usePathname();
  const { theme } = useTheme();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { cart } = useCart(); // get cart from context
  const cartCount = cart.length;  // reactive

  const navbarRef = useRef(null);
  const signInRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Sticky header on scroll
  const handleScroll = () => setSticky(window.scrollY >= 80);

  // Click outside handler
  const handleClickOutside = (event) => {
    if (signInRef.current && !signInRef.current.contains(event.target)) {
      setIsSignInOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen]);

  // Disable body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isSignInOpen || navbarOpen ? "hidden" : "";
  }, [isSignInOpen, navbarOpen]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // --- Fetch user profile when token changes
  // Load tokens safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access"));
      setRefresh(localStorage.getItem("refresh"));
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [token]);

  // --- Logout
  const handleLogout = async () => {
    try {
      if (!refresh) return;
      await axios.post(`${API_BASE}/api/auth/logout/`, {
        refresh_token: refresh,
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/";  // Full page reload to SignIn
      }
    }
  };

  return (
    <header
      className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 bg-white ${sticky ? "shadow-lg py-5" : "shadow-none py-6"
        }`}
    >
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}

      <div className="lg:py-0 py-2">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
          <Logo />

          {/* Desktop navigation */}
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            {headerData.map((item, index) => (
              <HeaderLink
                key={index}
                item={item}
                hrefOverride={item.label === "Demo" ? "/documentation" : undefined}
              />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!user ? (
              <button
                className="hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-16 py-5 rounded-full text-lg font-medium"
                onClick={() => setIsSignInOpen(true)}
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Cart icon */}
                <Link href="/cart" className="relative">
                  <Icon icon="mdi:cart-outline" className="text-2xl text-midnight_text dark:text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <ProfileDropdown user={user} onLogout={handleLogout} />
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2 rounded-lg"
            >
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
              <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${navbarOpen ? "translate-x-0" : "translate-x-full"
            } z-50`}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-midnight_text dark:text-midnight_text">
              <Logo />
            </h2>
            <button
              onClick={() => setNavbarOpen(false)}
              className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
            />
          </div>

          <nav className="flex flex-col items-start p-4">
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}

            <div className="mt-4 flex flex-col space-y-4 w-full">
              {!user ? (
                <button
                  className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white"
                  onClick={() => {
                    setIsSignInOpen(true);
                    setNavbarOpen(false);
                  }}
                >
                  Sign In
                </button>
              ) : (
                <>
                  <span className="text-white">Hi, {user.name}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setNavbarOpen(false);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* SignIn Modal */}
        {isSignInOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
            <div
              ref={signInRef}
              className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-white"
            >
              <button
                onClick={() => setIsSignInOpen(false)}
                className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
              >
                <Icon
                  icon="tabler:x"
                  className="text-black hover:text-primary text-24 inline-block me-2"
                />
              </button>
              <Signin onSuccess={(userData) => handleLogin(userData, "Login successful")} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

