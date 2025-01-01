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
    <footer className="bg-gray-100" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Logo and Description Row */}
        <section className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex justify-center md:justify-start mb-8 md:mb-0">
            <img
              src={Logo}
              alt="360 Driving School Logo"
              className="w-50 h-40 object-contain"
              aria-label="360 Driving School"
            />
          </div>

          {/* Description and Subscription */}
          <div className="text-center md:text-left md:w-2/3">
            <div className="text-center">
              <p className="font-semibold mb-4 text-gray-700 text-lg md:text-xl mobile:text-md">
                Subscribe to our newsletter for the latest updates and news.
              </p>
              {/* Input Section */}
              <form
                className="mt-4 flex flex-col justify-center items-center space-y-4 md:space-y-0 md:flex-row md:space-x-4"
                aria-labelledby="newsletter-form"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Enter your email address for the newsletter
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mobile:w-full transition-all duration-200 ease-in-out text-center"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out md:w-auto mt-2 md:mt-0 mobile:w-full"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <nav aria-labelledby="footer-navigation">
              <ul
                id="footer-navigation"
                className="mt-12 flex flex-col md:flex-row justify-center gap-6 md:gap-8 lg:gap-12"
              >
                <li>
                  <Link
                    to="/about-us"
                    className="transition hover:text-red-700"
                    aria-label="About 360 Driving School"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses"
                    className="transition hover:text-red-700"
                    aria-label="Book a driving lesson"
                  >
                    Booking
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="transition hover:text-red-700"
                    aria-label="Contact 360 Driving School"
                  >
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-and-policy"
                    className="transition hover:text-red-700"
                    aria-label="Privacy and Policy"
                  >
                    Privacy and Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faqs"
                    className="transition hover:text-red-700"
                    aria-label="Frequently Asked Questions"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Back to Top Button */}
          <div className="mt-8 text-center">
            <button
              onClick={scrollToTop}
              className="px-8 py-4 text-white bg-red-600 rounded-full hover:bg-red-700 transition duration-300 ease-in-out text-lg lg:invisible md:text-base sm:invisible"
              aria-label="Scroll to top"
            >
              Top
            </button>
          </div>
        </section>

        {/* Copyright */}
        <section className="mt-12 text-center" aria-labelledby="copyright-info">
          <p
            id="copyright-info"
            className="text-md text-gray-600"
            aria-label="Copyright 360 Driving School"
          >
            &copy; 2024 360 Driving School. All rights reserved.
          </p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
