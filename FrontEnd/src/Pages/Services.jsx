import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import manuel from "../assets/manuel.png";
import automatic from "../assets/automatic.png";
import PackageCard from "../Components/PackageCard";
import FormModal from "../Components/FormModal";
import refresher from "../assets/ref.jpg";
import motorway from "../assets/mot.jpg";
import parking from "../assets/par.jpg";
import night from "../assets/nig.jpg";
import eco from "../assets/eco.jpeg";
import winter from "../assets/win.jpeg";

const BookingPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedTransmission, setSelectedTransmission] = useState("Manual");
  const [selectedPackage, setSelectedPackage] = useState("Starter Package");
  const [preferredTime, setPreferredTime] = useState("morning");

  const handleBookClick = (transmission) => {
    setSelectedTransmission(transmission);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedTransmission("Manual"); // Reset to default
    setSelectedPackage("Starter Package"); // Reset package selection
  };

  const handleSelectTransmission = (transmission) => {
    setSelectedTransmission(transmission);
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsFormVisible(true); // Show form when a package is selected
  };

  useEffect(() => {
    setSelectedTransmission("Manual");
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Helmet for SEO */}
      <Helmet>
        <title>Book Driving Lessons | Choose Manual or Automatic Transmission</title>
        <meta
          name="description"
          content="Book driving lessons with 360 Drive Academy. Choose manual or automatic transmission, select your preferred package, and get started today!"
        />
        <meta
          name="keywords"
          content="driving lessons, manual transmission, automatic transmission, driving packages, driving school, book lessons"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com/booking" />
        
        {/* Open Graph tags for social media */}
        <meta property="og:title" content="Book Driving Lessons | 360 Drive Academy" />
        <meta
          property="og:description"
          content="Book driving lessons with 360 Drive Academy. Choose manual or automatic transmission, select your preferred package, and get started today!"
        />
        <meta property="og:image" content="https://yourwebsite.com/images/booking-page-image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/booking" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book Driving Lessons | 360 Drive Academy" />
        <meta
          name="twitter:description"
          content="Book driving lessons with 360 Drive Academy. Choose manual or automatic transmission, select your preferred package, and get started today!"
        />
        <meta name="twitter:image" content="https://yourwebsite.com/images/booking-page-image.jpg" />
      </Helmet>

      {/* Header Section */}
      <header className="bg-red-600 text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Book Your Driving Lessons</h1>
          <p className="text-lg">
            Get started with us. Choose manual or automatic transmission
            lessons.
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
            {[
              {
                title: "Starter Package",
                price: "£ 300",
                discount: "20% OFF",
                description:
                  "Perfect for beginners. Includes 10 driving lessons.",
                action: () => handleSelectPackage("Starter Package"),
              },
              {
                title: "Advanced Package",
                price: "£ 350",
                discount: "15% OFF",
                description:
                  "For intermediate learners. Includes 15 driving lessons.",
                action: () => handleSelectPackage("Advanced Package"),
              },
              {
                title: "Expert Package",
                price: "£ 500",
                discount: "10% OFF",
                description:
                  "For experienced learners. Includes 20 driving lessons.",
                action: () => handleSelectPackage("Expert Package"),
              },
            ].map((pkg, index) => (
              <PackageCard
                key={index}
                title={pkg.title}
                price={pkg.price}
                discount={pkg.discount}
                description={pkg.description}
                onSelect={pkg.action}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12 sm:text-5xl">
      Additional Driving Courses to Enhance Your Skills
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {[
        {
          title: "Motorway Driving Course",
          price: "£150",
          discount: "10% OFF",
          description:
            "Focused on motorway driving, includes 5 lessons for high-speed and complex traffic.",
          action: () => handleSelectPackage("Motorway Driving Course"),
          image: motorway,
          alt: "Motorway Driving Course",
        },
        {
          title: "Refresher Course",
          price: "£200",
          discount: "15% OFF",
          description:
            "For licensed drivers to rebuild confidence. Includes 8 situational driving lessons.",
          action: () => handleSelectPackage("Refresher Course"),
          image: refresher,
          alt: "Refresher Driving Course",
        },
        {
          title: "Night Driving Course",
          price: "£120",
          discount: "5% OFF",
          description:
            "Teaches safe night-driving techniques, with 4 lessons focused on reduced visibility.",
          action: () => handleSelectPackage("Night Driving Course"),
          image: night,
          alt: "Night Driving Course",
        },
        {
          title: "Parking Mastery Course",
          price: "£100",
          discount: "No Discount",
          description:
            "Specialized in parallel parking, reverse parking, and tight-space navigation.",
          action: () => handleSelectPackage("Parking Mastery Course"),
          image: parking,
          alt: "Parking Mastery Course",
        },
        {
          title: "Eco-Friendly Driving Course",
          price: "£180",
          discount: "10% OFF",
          description:
            "Learn fuel-efficient techniques to reduce emissions and save on fuel costs.",
          action: () =>
            handleSelectPackage("Eco-Friendly Driving Course"),
          image: eco,
          alt: "Eco-Friendly Driving Course",
        },
        {
          title: "Winter Driving Course",
          price: "£200",
          discount: "20% OFF",
          description:
            "Focused on icy and snowy conditions, with 6 lessons for hazard management.",
          action: () => handleSelectPackage("Winter Driving Course"),
          image: winter,
          alt: "Winter Driving Course",
        },
      ].map((course, index) => (
        <div
          key={index}
          className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
        >
          {/* Discount Badge */}
          {course.discount !== "No Discount" && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full">
              {course.discount}
            </div>
          )}

          {/* Course Image */}
          <img
            src={course.image}
            alt={course.alt}
            className="w-full h-48 object-cover rounded-t-xl"
          />

          {/* Course Details */}
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {course.title}
            </h3>
            <h4 className="text-3xl font-extrabold text-gray-800 mb-3">
              {course.price}
            </h4>
            <p className="text-gray-600 mb-4">{course.description}</p>

            {/* Action Button */}
            <button
              onClick={course.action}
              className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition"
              aria-label={`Book ${course.title} now`}
            >
              Select {course.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Booking Form (Dynamic) */}
      <FormModal
        isVisible={isFormVisible}
        onClose={handleCloseForm}
        transmissionType={selectedTransmission}
        selectedPackage={selectedPackage}
        preferredTime={preferredTime}
        setPreferredTime={setPreferredTime}
      />
    </div>
  );
};

export default BookingPage;
