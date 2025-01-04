import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import manuel from "../assets/manuel.png";
import automatic from "../assets/automatic.png";
import PackageCard from "../Components/PackageCard";
import FormModal from "../Components/FormModal";
import axios from "axios";

const BookingPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedTransmission, setSelectedTransmission] = useState("Manual");
  const [selectedItem, setSelectedItem] = useState("started package"); // Changed to a generic selectedItem
  const [preferredTime, setPreferredTime] = useState("morning");

  // Fetch packages and courses from the API
  const [packages, setPackages] = useState([]);
  const [courses, setCourses] = useState([]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:4000/package");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/course");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    setSelectedTransmission("Manual");
    fetchPackages();
    fetchCourses();
  }, []);

  const handleCloseForm = () => {
    setIsFormVisible(false);
    // Resetting only the form visibility, keeping selected transmission/item for next selection
  };

  const handleSelectTransmission = (transmission) => {
    setSelectedTransmission(transmission);
  };

  const handleSelectItem = (item, type) => {
    const newItem = { ...item, type, transmission: selectedTransmission }; // Include transmission type
    setSelectedItem(newItem);
    setIsFormVisible(true);
  };

  return (
    <div className="bg-gray-50">
      {/* Helmet for SEO */}
      <Helmet>
        <title>
          Book Driving Lessons | Choose Manual or Automatic Transmission
        </title>
        <meta
          name="description"
          content="Book driving lessons with 360 Drive Academy. Choose manual or automatic transmission, select your preferred package or course, and get started today!"
        />
        <meta
          name="keywords"
          content="driving lessons, manual transmission, automatic transmission, driving packages, driving school, book lessons"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com/booking" />
      </Helmet>

      {/* Header Section */}
      <header className="bg-red-600 text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Book Your Driving Lessons</h1>
          <p className="text-lg">
            Get started with us. Choose manual or automatic transmission
            lessons, or select a package or course.
          </p>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold mb-12 text-gray-800 sm:text-5xl">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
                  "Select your lesson package or course and schedule a callback.",
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
                className="bg-white p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-red-100 text-red-600 w-16 h-16 flex items-center justify-center rounded-full shadow-lg">
                    <i className={`${step.icon} text-3xl`}></i>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transmission Options Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12 sm:text-5xl">
            Choose Your Transmission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                className={`relative bg-white shadow-xl rounded-lg p-8 text-center hover:shadow-2xl transition-transform transform hover:-translate-y-3 cursor-pointer ${
                  selectedTransmission === option.title.split(" ")[0]
                    ? "border-4 border-red-600"
                    : "border border-gray-200"
                }`}
              >
                {/* Highlight Icon for Selected Option */}
                {selectedTransmission === option.title.split(" ")[0] && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    ✓
                  </div>
                )}
                <img
                  src={option.image}
                  alt={option.title}
                  className="w-28 h-28 object-contain mb-6 mx-auto"
                />
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-base">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12 sm:text-5xl">
            Choose Your Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <PackageCard
                key={index}
                title={pkg.name}
                price={pkg.price}
                discount={pkg.offer}
                description={pkg.description}
                onSelect={() => handleSelectItem(pkg, "package")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12 sm:text-5xl">
            Additional Driving Courses to Enhance Your Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course, index) => (
              <div
                key={index}
                onClick={() => handleSelectItem(course, "course")}
                className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                {/* Discount Badge */}
                {course.offer && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                    {course.offer} % OFF
                  </div>
                )}

                {/* Course Image */}
                <img
                  src={`http://localhost:4000/${course.image}`}
                  alt={course.alt}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    {course.name}
                  </h3>
                  <h4 className="text-3xl font-extrabold text-gray-800 mb-3">
                    £ {course.price}
                  </h4>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <button
                    onClick={() => handleSelectItem(course)} // Generic select function
                    className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition"
                  >
                    Select {course.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form (Modal) */}
      <FormModal
        isVisible={isFormVisible}
        onClose={handleCloseForm}
        selectedItem={selectedItem}
        preferredTime={preferredTime}
        setPreferredTime={setPreferredTime}
      />
    </div>
  );
};

export default BookingPage;
