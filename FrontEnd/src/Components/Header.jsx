import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import easydrive from "../assets/easydrive.png";
import west from "../assets/west.png";
import ed from "../assets/ed.png";
import mockup from "../assets/mock.png";
import logo from "../assets/360logo.jpeg";
import { Link } from "react-router-dom";

const Header = () => {
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <section className="font-Poppins">
      {/* Hero Section */}
      <motion.div
        className="flex items-center justify-center opacity-100 md:h-[30rem] w-full xl:h-[45rem] lg:h-[35rem] gap-20 lg:flex-row mobile:flex-col mobile:justify-center mobile:items-center mobile:gap-5 mobile:h-[22rem] mobile:bg-cover bg-cover bg-[url('/src/assets/header.png')]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src={logo}
          alt="Logo"
          className="hidden desktop:hidden lg:opacity-60 lg:block lg:h-[25rem] lg:w-[30rem]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <motion.section
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <h1 className="text-white mobile:w-[21rem] xl:text-lg font-bold lg:w-[43rem] lg:text-md md:w-[42rem] md:text-sm mobile:text-[0.8rem]">
            At 360 Driving School, we are renowned for our distinctive teaching
            and learning methodologies. Our primary objective is to ensure that
            students drive with confidence and successfully pass their driving
            tests on their first attempt. Our instructors possess extensive
            knowledge and experience. We have over 10 years experience in the
            industry.
          </h1>
          <Link to="/booking">
            <motion.button
              className="bg-white text-black mobile:gap-2 flex items-center justify-center gap-8 font-bold p-2 hover:bg-red-600 text-m w-[15rem] h-12 shadow-lg shadow-black mobile:w-[9rem] mobile:mt-3 mobile:h-[2rem] mobile:text-[0.7rem] mt-10"
              animate={{
                scale: [1, 1.05, 1],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse", // Makes the scale animate back and forth
                },
              }}
            >
              Book Now{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-7 w-7 mobile:h-4 mobile:w-4 mobile:text-xs"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.section>
      </motion.div>

      {/* Features Section */}
      <div
        ref={featuresRef}
        className="h-auto w-full gap-20 mt-20 flex flex-wrap items-start justify-center shadow-l border-teal-600 shadow-teal-800 mobile:flex-col mobile:items-center mobile:gap-5 mobile:mt-10 mb-20"
      >
        {[
          {
            image: easydrive,
            title: "Easy driving courses",
            description:
              "Are you looking for an easy way to pass your driving license with an amazing instructor?",
          },
          {
            image: west,
            title: "West London rides",
            description:
              "Are you looking for an easy way to pass your driving license with an amazing instructor?",
          },
          {
            image: ed,
            title: "Complex courses for beginners",
            description:
              "You do not know how to drive a car, and you need to pass the driving test quickly and painlessly?",
          },
          {
            image: mockup,
            title: "Mock tests",
            description:
              "Are you stressed out about your upcoming driving test? We will prepare you well for your exam and you will pass it the first time.",
          },
        ].map((feature, index) => (
          <motion.section
            key={index}
            className="w-[20rem] pt-5 mobile:w-[18rem] mobile:text-center group"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            <img
              src={feature.image}
              alt={`${feature.title} Illustration`}
              className="mb-7 w-[15rem] h-[15rem] mx-auto mobile:w-[15rem] mobile:h-[15rem]"
            />
            <h1 className="text-red-600 text-3xl font-bold mobile:text-2xl text-center">
              {feature.title}
            </h1>
            <h2 className="text-l mt-1 mobile:text-sm ">
              {feature.description}
            </h2>
          </motion.section>
        ))}
      </div>
    </section>
  );
};

export default Header;
