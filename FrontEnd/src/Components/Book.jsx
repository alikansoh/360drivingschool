import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BookNowSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger when the section comes into view
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("book-now-section");
      const position = section.getBoundingClientRect();
      if (position.top < window.innerHeight && position.bottom >= 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="book-now-section"
      className="flex flex-col items-center justify-center mt-20 px-5 py-10 bg-gray-100"
      aria-labelledby="book-now-title"
    >
      {/* Headline */}
      <h2
        id="book-now-title"
        className={`text-3xl font-bold text-center mb-5 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Book Your Driving Lessons Today!
      </h2>

      {/* Description */}
      <p
        className={`text-lg text-gray-700 text-center mb-8 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Learn to drive confidently with our expert instructors. Our personalized
        driving lessons cater to all levels, ensuring you pass your test with
        ease. Start your journey toward safe driving today.
      </p>

      {/* Book Now Button */}
      <Link
        to="/courses"
        aria-label="Book driving lessons now"
        className={`bg-red-600 text-white text-lg font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 focus:outline-none transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-105" : "opacity-0"
        }`}
      >
        Book Driving Lessons Now
      </Link>
    </section>
  );
};

export default BookNowSection;
