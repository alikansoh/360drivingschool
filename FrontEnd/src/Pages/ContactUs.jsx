import React, { useEffect, useState } from "react";
import contact from "../assets/contact.jpg";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import emailjs from "emailjs-com"; // Import EmailJS

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);

  // Page load animation
  useEffect(() => {
    document.body.classList.add("animate-page");
    return () => {
      document.body.classList.remove("animate-page");
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setFormStatus("All fields are required.");
      return;
    }

    try {
      const templateParams = {
        from_name: name, // The user's name
        email_sender: email, // The user's email (used in From Email and Reply-To)
        message: message, // The message from the form
      };

      const response = await emailjs.send(
        "service_bvrbsab", // Your EmailJS service ID
        "template_x0wncxr", // Your EmailJS template ID
        templateParams, // Data for the template
        "A4JrpQy20GzSe3cjz" // Your EmailJS user ID
      );

      console.log("Message sent", response);
      setFormStatus("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" }); // Clear form after submission
    } catch (error) {
      console.error("Error sending email:", error);
      setFormStatus("There was an error. Please try again later.");
    }
  };

  return (
    <section className="bg-gray-100 mt-0 overflow-hidden">
      {/* Helmet for SEO */}
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="contact driving school, driving lessons inquiry, 360 drive Academy, learn to drive, contact us driving Academy"
        />
        <meta
          name="description"
          content="Get in touch with 360 Drive Academy for driving lessons, inquiries, or questions. Our team is here to help you."
        />
        <meta property="og:title" content="Contact Us - 360 Drive Academy" />
        <meta
          property="og:description"
          content="Have questions? Contact 360 Drive Academy and we will respond within 24 hours."
        />
        <meta property="og:image" content={contact} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content="Contact Us - 360 Drive Academy" />
        <meta
          name="twitter:description"
          content="Get in touch with 360 Drive Academy for inquiries, feedback, or to book driving lessons."
        />
        <meta name="twitter:image" content={contact} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={window.location.href} />
        <title>Contact Us - 360 Drive Academy </title>
      </Helmet>

      {/* Header Section with Image */}
      <header className="relative w-full mb-20 mt-0 h-[475px] mobile:h-[15rem] text-red-600">
        <img
          src={contact}
          alt="Contact 360 Drive Academy for driving lessons"
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
      </header>

      {/* Contact Info Section */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Phone */}
          <a href="tel:+447789471859" aria-label="Call 360 Drive Academy">
            <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all ease-in-out duration-500">
              <FaPhoneAlt className="text-4xl text-red-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Call Us
              </h3>
              <p className="text-base text-gray-700 text-center">
                Speak with us by phone at{" "}
                <strong>
                  <a href="tel:+447789471859">+447789471859</a>
                </strong>
                . Available Monday to Friday, 9 AM - 9 PM.
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@360drivingschool.co.uk"
            aria-label="Email 360 Drive Academy "
          >
            <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all ease-in-out duration-500">
              <FaEnvelope className="text-4xl text-red-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Email Us
              </h3>
              <p className="text-base text-gray-700 text-center">
                Send us an email at{" "}
                <strong>
                  <a href="mailto:info@360drivingschool.co.uk">
                    info@360driveacademy.co.uk
                  </a>
                </strong>
                , and we will get back to you within 24 hours.
              </p>
            </div>
          </a>

          {/* Address */}
          <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all ease-in-out duration-500">
            <FaMapMarkerAlt className="text-4xl text-red-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Our Location
            </h3>
            <p className="text-base text-gray-700 text-center">
              <strong>London, UK</strong>
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-10 rounded-xl shadow-xl mb-16 transition-all ease-in-out duration-500 transform hover:scale-105">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
            Send Us a Message
          </h2>
          <form
            onSubmit={handleSubmit}
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
                value={formData.name}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.message}
                onChange={handleChange}
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
          {/* Form status message */}
          {formStatus && (
            <div
              className={`mt-4 text-center ${
                formStatus.includes("error") ? "text-red-600" : "text-green-600"
              }`}
            >
              <p>{formStatus}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
