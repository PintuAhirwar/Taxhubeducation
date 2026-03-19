"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

// ── Desktop positions (aapne set ki hui) ────────────────
const POSITIONS_DESKTOP = [
  { left: "55%", top: "25%", animDelay: "0s"   },  // 0
  { left: "85%", top: "35%", animDelay: "0.7s" },  // 1
  { left: "51%", top: "42%", animDelay: "1.2s" },  // 2
  { left: "89%", top: "55%", animDelay: "0.4s" },  // 3
  { left: "53%", top: "60%", animDelay: "0.9s" },  // 4
];

// ── Mobile positions — screen choti hai toh cards thode
//    alag jagah rakhe hain taaki overlap na ho ────────────
const POSITIONS_MOBILE = [
  { left: "20%", top: "50%", animDelay: "0s"   },  // 0
  { left: "78%", top: "65%", animDelay: "0.7s" },  // 1sj
  { left: "15%", top: "60%", animDelay: "1.2s" },  // 2
  { left: "80%", top: "55%", animDelay: "0.4s" },  // 3 cafinal
  { left: "20%", top: "70%", animDelay: "0.9s" },  // 4
];

const FloatingCards = ({ cards = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const POSITIONS = isMobile ? POSITIONS_MOBILE : POSITIONS_DESKTOP;

  const sorted = [...cards]
    .filter((c) => c.is_active !== false)
    .sort((a, b) => a.position_index - b.position_index);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {sorted.map((card) => {
        const pos = POSITIONS[card.position_index];
        if (!pos) return null;

        return (
          <div
            key={card.id ?? card.position_index}
            className="absolute flex items-center rounded-xl
              shadow-[0_4px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm
              border border-white/30"
            style={{
              left: pos.left,
              top: pos.top,
              background: card.bg_color || "#ffffff",
              animation: `heroFloat 3.5s ease-in-out infinite`,
              animationDelay: pos.animDelay,
              transform: "translate(-50%, -50%)",
              // ── Desktop: normal size | Mobile: compact ──
              padding: isMobile ? "6px 10px" : "10px 14px",
              gap: isMobile ? "7px" : "10px",
              minWidth: isMobile ? "100px" : "140px",
            }}
          >
            {/* Icon */}
            <div
              className="rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: (card.icon_color || "#2563eb") + "18",
                width:  isMobile ? 24 : 32,
                height: isMobile ? 24 : 32,
              }}
            >
              <Icon
                icon={card.icon || "mdi:office-building"}
                style={{
                  color: card.icon_color || "#2563eb",
                  fontSize: isMobile ? 13 : 18,
                }}
              />
            </div>

            {/* Text */}
            <div>
              <div
                className="font-semibold leading-none whitespace-nowrap"
                style={{
                  color: "#111827",
                  fontSize: isMobile ? "11px" : "14px",
                }}
              >
                {card.label}
              </div>
              {card.sub_label && (
                <div
                  className="leading-none whitespace-nowrap mt-0.5"
                  style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "9px" : "11px",
                  }}
                >
                  {card.sub_label}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes heroFloat {
          0%,100% { transform: translate(-50%, -50%) translateY(0px);   }
          50%      { transform: translate(-50%, -50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default FloatingCards;