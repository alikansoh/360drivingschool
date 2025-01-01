import React from "react";
import { FaShieldAlt, FaHandshake, FaStar } from "react-icons/fa"; // React Icons
import missionImage from "../assets/mission.jpg"; // Replace with mission image
import visionImage from "../assets/hero.jpg"; // Replace with vision image
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AboutUs() {
  return (
    
    <section className="bg-white py-16">
        <Helmet>
        <title>Contact Us | 360 Drive Academy </title>
        <meta
          name="description"
          content="Contact 360 Drive Academy for expert driving lessons. Reach us by phone, email, or send us a message. We're here to assist you!"
        />
      </Helmet>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            About Us
          </h1>
          <p className="mt-4 sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're dedicated to helping you become a confident, safe, and skilled
            driver with our expert guidance and personalized approach.
          </p>
        </header>

        {/* Mission and Vision Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Mission */}
          <article className="relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-all ease-in-out duration-500">
            <img
              src={missionImage}
              alt="Our mission to create skilled, confident drivers"
              className="w-full h-[300px] sm:h-[350px] lg:h-[400px] object-cover rounded-xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="absolute bottom-6 left-8 text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Our Mission
              </h2>
              <p className="text-sm sm:text-lg lg:text-xl">
                To create confident, skilled, and responsible drivers by
                providing clear, easy-to-understand driving lessons.
              </p>
            </div>
          </article>

          {/* Vision */}
          <article className="relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-all ease-in-out duration-500">
            <img
              src={visionImage}
              alt="Our vision to be the leading driving school"
              className="w-full h-[300px] sm:h-[350px] lg:h-[400px] object-cover rounded-xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="absolute bottom-6 left-8 text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Our Vision
              </h2>
              <p className="text-sm sm:text-lg lg:text-xl">
                To be the most trusted and respected driving school, fostering
                safe drivers who are prepared for any road ahead.
              </p>
            </div>
          </article>
        </section>

        {/* Our Values Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Value 1: Safety First */}
            <div className="flex flex-col items-center bg-gray-100 p-6 sm:p-8 rounded-lg shadow-lg hover:scale-105 transition-all ease-in-out duration-300">
              <FaShieldAlt className="text-5xl sm:text-6xl text-gray-700 mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Safety First
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                We prioritize the safety of our students, ensuring they have the
                skills to drive confidently and responsibly.
              </p>
            </div>

            {/* Value 2: Empathy & Patience */}
            <div className="flex flex-col items-center bg-gray-100 p-6 sm:p-8 rounded-lg shadow-lg hover:scale-105 transition-all ease-in-out duration-300">
              <FaHandshake className="text-5xl sm:text-6xl text-gray-700 mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Empathy & Patience
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                We understand every learner is different. Our instructors are
                patient and empathetic, adapting to your pace.
              </p>
            </div>

            {/* Value 3: Excellence */}
            <div className="flex flex-col items-center bg-gray-100 p-6 sm:p-8 rounded-lg shadow-lg hover:scale-105 transition-all ease-in-out duration-300">
              <FaStar className="text-5xl sm:text-6xl text-gray-700 mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Excellence
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                We are committed to providing the highest standard of driving
                instruction, ensuring you become the best driver possible.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-900 text-white py-16 text-center rounded-lg shadow-lg p-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Journey with Us?
          </h2>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed mobile:text-sm">
            Begin your driving lessons with us and gain the skills and
            confidence to drive safely and responsibly. Our expert instructors
            are here to guide you.
          </p>
          <Link to="/courses">
            <button
              className="bg-red-600 py-3 px-8 rounded-full text-white font-semibold shadow-lg hover:bg-red-700 transition-all duration-300"
              aria-label="Get started with driving lessons"
            >
              Get Started Now
            </button>
          </Link>
        </section>
      </div>
    </section>
  );
}
