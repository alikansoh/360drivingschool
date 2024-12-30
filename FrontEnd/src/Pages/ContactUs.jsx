import React, { useEffect } from "react";
import contact from "../assets/contact.jpg";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactUs() {
  // Page load animation
  useEffect(() => {
    document.body.classList.add("animate-page");
    return () => {
      document.body.classList.remove("animate-page");
    };
  }, []);

  return (
    <section className="bg-gray-100 mt-0 overflow-hidden">
      {/* Header Section with Image */}
      <div className="relative w-full mb-20 mt-0 h-[475px] mobile:h-[15rem] text-red-600">
        <img
          src={contact}
          alt="Header Image"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full p-2">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mobile:text-3xl">
            Contact Us
          </h1>
          <h2 className="text-2xl text-white mt-4 mobile:text-sm">
            We'd love to hear from you! Reach out to us for any inquiries.
          </h2>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="max-w-screen-xl mx-auto  px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Phone */}
          <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all ease-in-out duration-500">
            <FaPhoneAlt className="text-4xl text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Call Us
            </h3>
            <p className="text-base text-gray-700 text-center">
              Speak with our support team directly at{" "}
              <strong>07735337198</strong>. Available Monday to Friday, 9 AM
              - 9 PM.
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all ease-in-out duration-500">
            <FaEnvelope className="text-4xl text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Email Us
            </h3>
            <p className="text-base text-gray-700 text-center">
              Send us an email at <strong>baderuwl@hotmail.co.uk</strong>, and we
              will get back to you within 24 hours.
            </p>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all ease-in-out duration-500">
            <FaMapMarkerAlt className="text-4xl text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Our Location
            </h3>
            <p className="text-base text-gray-700 text-center">
           
              <strong>London </strong>. 
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-10 rounded-xl shadow-xl mb-16 transition-all ease-in-out duration-500 transform hover:scale-105">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
            Send Us a Message
          </h2>
          <form
            action="#"
            method="POST"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-lg font-medium text-gray-900 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Full Name"
                required
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-lg font-medium text-gray-900 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email Address"
                required
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Message */}
            <div className="sm:col-span-2 flex flex-col">
              <label
                htmlFor="message"
                className="text-lg font-medium text-gray-900 mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="How can we assist you?"
                required
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 text-center">
              <button
                type="submit"
                className="bg-red-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-700 transition-all duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
