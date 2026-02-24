import { motion } from "framer-motion";
import { FaStar, FaCar, FaUsers, FaShieldAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import aboutImage from "../assets/2.webp";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const highlights = [
  "Flexible lesson scheduling — weekdays & weekends",
  "Manual & automatic vehicles available",
  "Covering West London & surrounding areas",
];

const AboutUs = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortText =
    "At 360 drive Academy, we are dedicated to providing exceptional driving lessons in London and surrounding areas. Our team of professional driving instructors brings over 10+ years of experience, ensuring you gain the skills and confidence needed to pass your driving test on the first attempt.";
  const fullText = `${shortText} Whether you're a beginner or looking to improve, our flexible driving courses cater to all levels. We specialize in manual and automatic driving lessons, offering personalized instruction in a safe, supportive environment. Our high first-time pass rate and commitment to quality make us the leading choice for driving tuition in West London and beyond.`;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-4">
          <span className="block w-8 h-0.5 bg-red-600 rounded-full" />
          <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
            Who We Are
          </span>
        </motion.div>

        {/* ── 2-col grid — same strategy as original ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 items-center">

          {/* ── Col 1 Row 1: Title ── */}
          <motion.div {...fadeUp(0.05)} className="md:col-start-1 md:row-start-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              About{" "}
              <span className="text-red-600 relative inline-block">
                360 Drive Academy
                {/* Wavy underline accent */}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M0 4 Q50 0 100 3 Q150 6 200 2"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.35"
                  />
                </svg>
              </span>
              <span className="block text-gray-900 mt-1">
                Your Trusted Driving Partner
              </span>
            </h2>
          </motion.div>

          {/* ── Col 2: Image — spans both rows on md+ ── */}
          <motion.div
            {...fadeUp(0.15)}
            className="md:col-start-2 md:row-start-1 md:row-span-2"
          >
            <div className="relative">
              {/* Decorative background block */}
              <div className="absolute -top-4 -right-4 rounded-2xl bg-red-50 border border-red-100" />

              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden  shadow-gray-200">
                <img
                  src={aboutImage}
                  alt="360 Academy driving instructor with student"
                  className="w-full  hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Floating badge at bottom of image */}
                
              </div>

              {/* Floating pill — desktop only */}
              
            </div>
          </motion.div>

          {/* ── Col 1 Row 2: Body + highlights + stats + CTA ── */}
          <motion.div
            {...fadeUp(0.1)}
            className="md:col-start-1 md:row-start-2 flex flex-col gap-6"
          >
            {/* Body text */}
            <div className="relative">
              <p
                className={`text-gray-600 leading-relaxed text-base transition-all duration-300 ${
                  !isExpanded ? "line-clamp-4 md:line-clamp-none" : ""
                }`}
              >
                {isExpanded ? fullText : shortText}
              </p>

              {/* Fade hint on mobile when collapsed */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent md:hidden pointer-events-none" />
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-600 font-semibold hover:text-red-700 transition mt-2 md:hidden text-sm flex items-center gap-1"
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Show Less ↑" : "Read More ↓"}
              </button>
            </div>

            {/* ── NEW: Feature highlights checklist ── */}
            <ul className="flex flex-col gap-2.5">
              {highlights.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-sm text-gray-700"
                >
                  <FaCheckCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: FaStar, value: "90%", label: "First-Time Pass Rate" },
                { icon: FaCar, value: "10+", label: "Expert Instructors" },
                { icon: FaUsers, value: "1000+", label: "Students Trained" },
                { icon: FaShieldAlt, value: "Safe", label: "& Reliable" },
              ].map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                  className="group bg-gray-50 hover:bg-red-600 border border-gray-100 hover:border-red-600 rounded-xl p-3 text-center transition-all duration-300 cursor-default"
                >
                  <Icon className="text-red-600 group-hover:text-white text-lg mx-auto mb-1.5 transition-colors duration-300" />
                  <p className="font-extrabold text-gray-900 group-hover:text-white text-base leading-tight transition-colors duration-300">
                    {value}
                  </p>
                  <p className="text-gray-500 group-hover:text-red-100 text-[11px] leading-tight mt-0.5 transition-colors duration-300">
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-4 flex-wrap">
              <motion.a
                href="/courses"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md shadow-red-100 transition-all duration-200 text-sm"
              >
                Explore Our Courses
                <FaArrowRight className="text-xs" />
              </motion.a>

              <a
                href="/contact-us"
                className="inline-flex items-center gap-1.5 text-gray-700 hover:text-red-600 font-semibold text-sm transition-colors duration-200 group"
              >
                Contact Us
                <span className="group-hover:translate-x-0.5 transition-transform duration-200 text-xs">→</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;