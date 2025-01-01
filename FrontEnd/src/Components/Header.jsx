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

  const features = [
    {
      image: easydrive,
      title: "Hassle-Free Driving Courses",
      description:
        "Looking for a straightforward way to pass your driving test with an exceptional instructor? Join us for a seamless experience.",
    },
    {
      image: west,
      title: "West London Driving Experiences",
      description:
        "Need an effortless path to obtaining your driving license in West London? Learn with top-notch instructors.",
    },
    {
      image: ed,
      title: "Beginner-Friendly Driving Courses",
      description:
        "New to driving? Start from scratch with expert guidance and pass your test stress-free.",
    },
    {
      image: mockup,
      title: "Practice with Mock Driving Tests",
      description:
        "Feeling nervous about your driving test? We’ll prepare you thoroughly for a confident first-time pass.",
    },
  ];

  return (
    <header className="font-Poppins">
      {/* Hero Section */}
      <motion.div
        className="flex items-center justify-center opacity-100 md:h-[30rem] w-full xl:h-[45rem] lg:h-[35rem] gap-20 lg:flex-row mobile:flex-col mobile:justify-center mobile:items-center mobile:gap-5 mobile:h-[22rem] mobile:bg-cover bg-cover bg-[url('/src/assets/header.png')]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        role="banner"
      >
        <motion.img
          src={logo}
          alt="360 Drive Academy Logo"
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
          <h1 className="text-white mobile:w-[18rem] m-auto xl:text-lg font-bold lg:w-[43rem] lg:text-md md:w-[42rem] md:text-md mobile:text-[0.8rem]">
            Welcome to 360 Academy. We specialize in professional driving
            lessons with exceptional instructors, offering over 10 years of
            industry expertise. Drive with confidence and pass your test on the
            first attempt!
          </h1>
          <Link to="/courses" aria-label="Book driving lessons now">
            <motion.button
              className="bg-white text-black mobile:gap-2 flex items-center justify-center gap-8 font-bold p-2 hover:bg-red-600 text-m w-[18rem] h-12 shadow-lg shadow-black mobile:w-[9rem] mobile:mt-3 mobile:h-[2rem] mobile:text-[0.7rem] mt-10"
              animate={{
                scale: [1, 1.05, 1],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
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
      <section
        ref={featuresRef}
        className="h-auto w-full gap-20 mt-20 flex flex-wrap items-start justify-center shadow-l border-teal-600 shadow-teal-800 mobile:flex-col mobile:items-center mobile:gap-5 mobile:mt-10 mb-20"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="sr-only">
          Key Features of 360 Drive Academy
        </h2>
        {features.map((feature, index) => (
          <motion.article
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
              alt={`${feature.title} - Driving Course`}
              className="mb-7 w-[15rem] h-[15rem] mx-auto mobile:w-[15rem] mobile:h-[15rem]"
              loading="lazy"
            />
            <h3 className="text-red-600 text-3xl font-bold mobile:text-2xl text-center">
              {feature.title}
            </h3>
            <p className="text-l mt-1 mobile:text-sm">{feature.description}</p>
          </motion.article>
        ))}
      </section>
    </header>
  );
};

export default Header;
