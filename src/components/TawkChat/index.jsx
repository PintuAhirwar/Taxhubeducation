"use client";
import { useEffect, useState } from "react";

export default function TawkChat() {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/69bc4aa825f53e1c37bb95aa/1jk3o79dg";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode.insertBefore(s1, s0);

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.setAttributes({}, function (error) {});
      // Bottom se 80px upar
      const iframe = document.querySelector("iframe[title='chat widget']");
      if (iframe) iframe.style.bottom = "80px";
    };

    // Chat khulne pe overlay dikhao
    window.Tawk_API.onChatMaximized = function () {
      setChatOpen(true);
    };

    // Chat band hone pe overlay hatao
    window.Tawk_API.onChatMinimized = function () {
      setChatOpen(false);
    };
  }, []);

  const handleOverlayClick = () => {
    if (window.Tawk_API && window.Tawk_API.minimize) {
      window.Tawk_API.minimize();
    }
    setChatOpen(false);
  };

  return (
    <>
      {/* Invisible overlay — chat open hone pe active */}
      {chatOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-40"
          style={{ background: "transparent" }}
        />
      )}
    </>
  );
}