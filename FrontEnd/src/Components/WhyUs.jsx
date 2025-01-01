import React from "react";
import yes from "../assets/yes.png";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const WhyUs = () => {
  const features = [
    "We maintain a high pass rate for our students.",
    "We offer door-to-door service for students within the area.",
    "Our instructors are both professional and approachable.",
    "We provide flexible scheduling options to suit your needs.",
    "Our modern vehicles are equipped with dual controls for added safety.",
    "We deliver personalized attention to every student for optimal learning.",
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      className="flex flex-col items-center justify-center mt-20 px-5 font-Poppins"
      aria-labelledby="why-choose-us"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <img
          src={yes}
          alt="Smiling checkmark icon indicating success"
          className="w-16 h-16 mx-auto animate-bounce"
        />
        <h1
          id="why-choose-us"
          className="text-3xl font-bold text-center text-gray-800 mb-6"
        >
          Why Choose 360 Driving School?
        </h1>
        <p className="text-lg text-gray-600 mt-3 mobile:text-lg">
          Discover why students trust us for their driving education.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-white shadow-md rounded-lg p-5 gap-4 hover:shadow-lg transition-all"
          >
            {/* Consistent size for the checkmark */}
            <FaCheckCircle className="text-red-500 text-3xl w-auto" />
            <p
              className="text-xl text-gray-800 mobile:text-sm font-bold"
              aria-label={feature}
            >
              {feature}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional SEO Content */}
      <div className="mt-10 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">
          Your Trusted Partner in Learning to Drive
        </h2>
        <p className="text-lg">
          At <strong>360 Driving School</strong>, we focus on delivering
          high-quality driving lessons with experienced instructors. Whether
          you're a beginner or need mock test preparation, we are here to
          ensure you pass your driving test with confidence.
        </p>
      </div>
    </section>
  );
};

export default WhyUs;
