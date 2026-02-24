import React from "react";
import { FaWhatsapp, FaCalendarAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingActions({ phone = "447789471859" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const openWhatsApp = (text = "Hi, I'm interested in driving lessons. Can you help me book?") => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openBooking = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const runAction = () => {
      if (isMobile) {
        window.dispatchEvent(new Event("openMobileBooking"));
      } else {
        const el = document.getElementById("inline-booking-aside");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => {
            const first = el.querySelector("input, button, textarea, select");
            first?.focus?.();
          }, 500);
        } else {
          window.dispatchEvent(new Event("openMobileBooking"));
        }
      }
    };

    if (location.pathname === "/") {
      runAction();
      return;
    }

    navigate("/", { replace: false });
    setTimeout(runAction, 300);
  };

  return (
    <div
      aria-hidden={false}
      className="fixed right-3 bottom-4 z-[70] flex flex-col gap-2 sm:gap-3"
    >
      <button
        onClick={() =>
          openWhatsApp("Hi, I'm interested in driving lessons. Can you help me book?")
        }
        aria-label="Message us on WhatsApp"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md flex items-center justify-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 opacity-90 hover:opacity-100"
      >
        <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />
      </button>

      <button
        onClick={openBooking}
        aria-label="Quick booking"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 opacity-90 hover:opacity-100"
      >
        <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />
      </button>
    </div>
  );
}