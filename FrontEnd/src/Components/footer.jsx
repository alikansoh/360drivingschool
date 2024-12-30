import React from "react";
import Logo from "../assets/360-foot.png";
import { Link } from "react-router-dom";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  };

  return (
    <footer className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Logo and Description Row */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex justify-center md:justify-start mb-8 md:mb-0">
            <img
              src={Logo}
              alt="360 Logo"
              className="w-50 h-40 object-contain"
            />
          </div>

          {/* Description and Subscription */}
          <div className="text-center md:text-left md:w-2/3">
            <div className="text-center">
              <p className="font-semibold mb-4 text-gray-700 text-lg md:text-xl mobile:text-md">
                Subscribe to our newsletter for the latest updates and news.
              </p>
              {/* Input Section */}
              <form className="mt-4 flex flex-col justify-center items-center space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 text-gray-700 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500  mobile:w-full transition-all duration-200 ease-in-out text-center "
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-white bg-red-600 r hover:bg-red-700 transition duration-200 ease-in-out md:w-auto mt-2 md:mt-0 mobile:w-full"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="mt-12">
              <ul className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 lg:gap-12">
                <li>
                  <Link to="/aboutus" className="transition hover:text-red-700">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="transition hover:text-red-700">
                    Booking
                  </Link>
                </li>
                <li>
                  <a className="transition hover:text-red-700" href="#">
                    Contact us
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-red-700" href="#">
                    privacy and policy
                  </a>
                </li>
                <li>
                  <Link to="/faqs" className="transition hover:text-red-700">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Back to Top Button */}
          <div className="mt-8 text-center">
            <button
              onClick={scrollToTop}
              className="px-8 py-4 text-white bg-red-600 rounded-full hover:bg-red-700 transition duration-300 ease-in-out text-lg lg:invisible md:text-base sm:invisible"
            >
              Top
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p className="text-md text-gray-600 ">
            &copy; 2024 360 Driving School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
