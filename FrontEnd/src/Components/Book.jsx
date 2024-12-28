import React from "react";
import { useState, useEffect } from "react";
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
    >
      {/* Headline */}
      <h2
        className={`text-3xl font-bold text-center mb-5 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Start Your Journey to Confident Driving Today!
      </h2>

      {/* Advice */}
      <p
        className={`text-lg text-gray-700 text-center mb-8 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0 "
        }`}
      >
        Join our trusted driving school and experience personalized lessons that
        will help you pass your test with ease. Whether you're a beginner or
        just need a refresher, we have the perfect course for you.
      </p>

      {/* Book Now Button */}
      
      <Link to ="/Booking"
        className={`bg-red-600 text-white text-lg font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 focus:outline-none transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-105" : "opacity-0 mobile:text-sm"
        }`}
      >
        Book Now
      </Link>
    </section>
  );
};

export default BookNowSection;
