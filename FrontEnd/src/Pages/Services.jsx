import React, { useState, useEffect } from "react";
import manuel from "../assets/manuel.png";
import automatic from "../assets/automatic.png";

const BookingPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedTransmission, setSelectedTransmission] = useState("Manual");
  const [selectedPackage, setSelectedPackage] = useState("");

  const handleBookClick = (transmission) => {
    setSelectedTransmission(transmission);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedTransmission("");
  };

  const handleSelectTransmission = (transmission) => {
    setSelectedTransmission(transmission);
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsFormVisible(true);
  };

  useEffect(() => {
    setSelectedTransmission("Manual");
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <header className="bg-red-600 text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4  ">
            Book Your Driving Lessons
          </h1>
          <p className="text-lg ">
            Get started with us. Choose manual or automatic transmission
            lessons.
          </p>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-8 sm:text-3xl ">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-red-600">
            {[
              {
                title: "Step 1",
                description:
                  "Choose the transmission type: Manual or Automatic.",
                icon: "fas fa-cogs",
              },
              {
                title: "Step 2",
                description:
                  "Select your lesson package and schedule a callback.",
                icon: "fas fa-calendar-check",
              },
              {
                title: "Step 3",
                description:
                  "Get expert driving lessons and pass your test confidently.",
                icon: "fas fa-car",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-lg rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:bg-red-50 duration-300 ease-in-out"
              >
                <div className="mb-4">
                  <i className={`${step.icon} text-4xl`}></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4 sm:text-xl ">
                  {step.title}
                </h3>
                <p className="text-gray-600 sm:text-base ">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transmission Options Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 sm:text-2xl">
            Choose Your Transmission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Manual Lessons",
                description:
                  "Learn to drive a manual car and become confident on the road.",
                action: () => handleSelectTransmission("Manual"),
                image: manuel,
              },
              {
                title: "Automatic Lessons",
                description:
                  "Simplify your learning process with automatic car lessons.",
                action: () => handleSelectTransmission("Automatic"),
                image: automatic,
              },
            ].map((option, index) => (
              <div
                key={index}
                onClick={option.action}
                className={`bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition cursor-pointer ${
                  selectedTransmission === option.title.split(" ")[0]
                    ? "border-4 border-red-600"
                    : ""
                }`}
              >
                <img
                  src={option.image}
                  alt={option.title}
                  className="w-24 h-24 object-contain mb-4 mx-auto"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 sm:text-2xl ">
            Choose Your Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Starter Package",
                discount: "20% OFF",
                description:
                  "Perfect for beginners. Includes 10 driving lessons.",
                action: () => handleSelectPackage("Starter Package"),
              },
              {
                title: "Advanced Package",
                discount: "15% OFF",
                description:
                  "For intermediate learners. Includes 15 driving lessons.",
                action: () => handleSelectPackage("Advanced Package"),
              },
              {
                title: "Expert Package",
                discount: "10% OFF",
                description:
                  "For experienced learners. Includes 20 driving lessons.",
                action: () => handleSelectPackage("Expert Package"),
              },
            ].map((pkg, index) => (
              <div
                key={index}
                className="bg-gray-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition sm:p-4"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {pkg.title}
                </h3>
                <p className="text-red-600 font-bold text-lg mb-4">
                  {pkg.discount}
                </p>
                <p className="text-gray-600 mb-6 text-sm">{pkg.description}</p>
                <button
                  onClick={pkg.action}
                  className="bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  Select {pkg.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 sm:text-2xl ">
            Additional Courses
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enhance your skills with specialized driving courses designed to
            meet your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Defensive Driving",
                description:
                  "Learn techniques to drive safely and avoid accidents.",
                icon: "fas fa-shield-alt",
              },
              {
                title: "Highway Driving",
                description: "Master highway driving with confidence and ease.",
                icon: "fas fa-road",
              },
              {
                title: "Test Preparation",
                description: "Ace your driving test with expert guidance.",
                icon: "fas fa-file-alt",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition sm:p-4"
              >
                <div className="mb-4 text-center text-red-600">
                  <i className={`${course.icon} text-4xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form (Dynamic) */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Book Your {selectedTransmission} Lessons
            </h2>
            <form>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border-red-600 rounded-md p-3 border-2  focus:border-red-600"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full border-red-600 rounded-md p-3 border-2   focus:border-red-600"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="preferred-time"
                >
                  Preferred Time
                </label>
                <select
                  id="preferred-time"
                  className="w-full border-red-600 border-2 rounded-md p-3  focus:border-red-600"
                >
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 transition"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
