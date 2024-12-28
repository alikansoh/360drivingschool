import React from "react";
import yes from "../assets/yes.png";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const WhyUs = () => {
  const features = [
    "We have a high pass rate.",
    "Door-to-door service from home or work, if you are within the area.",
    "Our instructors are friendly and professional.",
    "We provide flexible scheduling for your convenience.",
    "Modern vehicles equipped with dual controls for safety.",
    "We offer personalized attention to each student.",
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
    <section className="flex flex-col items-center justify-center mt-20 px-5 font-Poppins">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <img
          src={yes}
          alt="true"
          className="w-16 h-16 mx-auto animate-bounce"
        />
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          WHY 360 DRIVING SCHOOL?
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
            <FaCheckCircle className="text-red-500 text-2xl" />
            <p className="text-lg text-gray-800 mobile:text-sm">{feature}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyUs;
