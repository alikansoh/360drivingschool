import React, { useState } from "react";

const faqs = [
  {
    question: "What is 360 Driving School?",
    answer:
      "360 Driving School is a comprehensive driving school designed to help new drivers learn essential skills, build confidence, and pass their driving tests with ease.",
  },
  {
    question: "What is the minimum age to start driving lessons?",
    answer:
      "The minimum age to start driving lessons depends on your location. In most regions, you can start learning at 16, but be sure to check your local regulations.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "You can enroll by visiting our website and selecting the course that fits your needs. Fill out the enrollment form and we will get in touch to schedule your first lesson.",
  },
  {
    question: "What types of courses do you offer?",
    answer:
      "We offer beginner driving lessons, advanced driving techniques, defensive driving, and courses tailored for specific driving tests.",
  },
  {
    question: "Are your instructors experienced?",
    answer:
      "Yes, our instructors are experienced and passionate about driving. They have been teaching drivers for years and are committed to helping you succeed.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can cancel or reschedule a lesson with at least 24 hours’ notice without penalty. ",
  },
  {
    question: "Do you provide a car for the driving test?",
    answer:
      "Yes, we provide a car for your driving test if you book through us. Our vehicles are well-maintained and equipped for safe driving.",
  },
  {
    question: "Can I learn in an automatic car?",
    answer:
      "Yes, we offer lessons in both manual and automatic vehicles. Be sure to specify your preference when booking.",
  },
  {
    question: "Are your instructors certified?",
    answer:
      "All our instructors are fully certified, experienced, and friendly. They are committed to helping you become a confident and safe driver.",
  },
  {
    question: "How do I prepare for my driving test?",
    answer:
      "Your instructor will guide you through practice tests, teach you all the necessary skills, and review the specific requirements of your local licensing authority to ensure you're fully prepared.",
  },
  {
    question: "Do you offer evening or weekend lessons?",
    answer:
      "Yes, we offer evening and weekend lessons to accommodate your busy schedule. Our instructors are available during evenings and weekends to meet your needs.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 px-6 lg:px-20 max-w-5xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-red-600 rounded-lg shadow-sm"
          >
            <button
              className="w-full text-left px-6 py-4 text-lg font-semibold text-gray-700 flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="text-gray-500">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
