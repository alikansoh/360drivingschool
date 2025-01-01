import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate(); // React Router Hook

  const faqs = [
    {
      question: "How do I book driving lessons?",
      answer:
        "You can book driving lessons through our website, by calling us directly. Scheduling is flexible to fit your needs.",
    },
    {
      question: "What are the prices for lessons?",
      answer:
        "Our prices depend on the package you choose. We offer single lessons, discounted bundles, and customizable options. Contact us for the latest rates.",
    },
    {
      question: "Do you provide cars for the driving test?",
      answer:
        "Yes, we offer cars for the driving test. They are equipped with dual controls for your safety and meet all testing requirements.",
    },
    {
      question: "Are your instructors certified?",
      answer:
        "All our instructors are fully certified, experienced, and friendly. They are committed to helping you become a confident and safe driver.",
    },
    {
      question: "What happens if I cancel a lesson?",
      answer:
        "We understand that plans change. You can cancel or reschedule a lesson with at least 24 hours' notice without any penalty.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 mt-20" aria-labelledby="faq-header">
      <div className="max-w-screen-lg mx-auto px-5">
        {/* Header Section */}
        <header className="text-center mb-6">
          <h2
            id="faq-header"
            className="text-3xl font-bold text-gray-800 mb-6"
            aria-level="2"
            role="heading"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Have questions? We’ve got answers! Here are the most common ones we
            receive from our students.
          </p>
        </header>

        {/* FAQ Accordion Section */}
        <div className="space-y-4 mb-6">
          {faqs.map((faq, index) => (
            <article
              key={index}
              className="bg-white shadow-md rounded-lg transition-all overflow-hidden"
              aria-labelledby={`faq-question-${index}`}
            >
              {/* Question (Interactive Element) */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-medium focus:outline-none hover:bg-gray-50"
                aria-expanded={openIndex === index ? "true" : "false"}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span>{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-red-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 14a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 14z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Answer Section (Hidden/Shown based on the state) */}
              <div
                id={`faq-answer-${index}`}
                className={`px-6 pb-4 mt-2 text-red-600 mobile:text-sm ${
                  openIndex === index ? "block" : "hidden"
                }`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <p>{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Button to Full FAQ Page */}
        <div className="text-center">
          <button
            onClick={() => navigate("/faqs")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            View All FAQs
          </button>
        </div>
      </div>
    </section>
  );
};

export default Faq;
