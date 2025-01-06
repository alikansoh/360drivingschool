import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    question: "What is 360 Drive Academy?",
    answer:
      "360 Drive Academy is a comprehensive driving school designed to help new drivers learn essential skills, build confidence, and pass their driving tests with ease. We offer beginner to advanced driving courses, including defensive driving and test preparation.",
  },
  {
    question: "What is the minimum age to start driving lessons?",
    answer:
      "The minimum age to start driving lessons depends on your location. In most regions, you can start learning at 16, but be sure to check your local regulations for specific requirements.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "To enroll in one of our driving courses, simply visit our website, select the course that fits your needs, and fill out the enrollment form. We will contact you to schedule your first lesson.",
  },
  {
    question: "What types of courses do you offer?",
    answer:
      "We offer a variety of courses, including beginner driving lessons, advanced driving techniques, defensive driving courses, and test preparation lessons tailored to your local driving test requirements.",
  },
  {
    question: "Are your instructors experienced?",
    answer:
      "Yes, all of our instructors are experienced professionals with years of teaching experience. They are fully certified and passionate about helping you succeed on the road.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We offer flexible scheduling with a 24-hour notice for cancellations or rescheduling. This ensures that you have the flexibility to manage your lessons.",
  },
  {
    question: "Do you provide a car for the driving test?",
    answer:
      "Yes, we provide a car for your driving test if you book your lessons through us. Our vehicles are regularly maintained and are equipped with all necessary safety features.",
  },
  {
    question: "Can I learn in an automatic car?",
    answer:
      "Yes, we offer both manual and automatic cars for driving lessons. Be sure to specify your preference when booking your lessons with us.",
  },
  {
    question: "Are your instructors certified?",
    answer:
      "Yes, all our instructors are fully certified, trained, and committed to ensuring you become a confident and skilled driver. They are friendly, patient, and passionate about driving instruction.",
  },
  {
    question: "How do I prepare for my driving test?",
    answer:
      "Our instructors will provide practice tests, teach essential skills, and review local driving test requirements to ensure you're well-prepared for your test.",
  },
  {
    question: "Do you offer evening or weekend lessons?",
    answer:
      "Yes, we offer flexible evening and weekend driving lessons to accommodate your busy schedule. Our instructors are available to meet your needs during those times.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 px-6 lg:px-20 max-w-5xl mx-auto mt-10">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Frequently Asked Questions | 360 Drive Academy </title>
        <meta
          name="description"
          content="Find answers to your questions about 360 Drive Academy, including course details, age requirements, instructor qualifications, cancellation policies, and more."
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="360 Drive Academy, driving lessons, driving courses, FAQ, driving test preparation" />
        <link rel="canonical" href="https://www.360driveacademy.com/faqs" />
      </Helmet>

      <h1 className="text-4xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-red-600 rounded-lg shadow-sm"
            itemScope
            itemType="https://schema.org/Question"
          >
            <button
              className="w-full text-left px-6 py-4 text-lg font-semibold text-gray-700 flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span itemProp="name">{faq.question}</span>
              <span className="text-gray-500">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-6 py-4 text-gray-600"
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">{faq.answer}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
