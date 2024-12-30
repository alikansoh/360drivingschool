import React from "react";
import { FaIdCard, FaBook, FaCar, FaSchool } from "react-icons/fa";

export default function UsefulLinks() {
  const links = [
    {
      category: "Licensing",
      icon: <FaIdCard className="text-4xl text-red-600 mb-4" />,
      items: [
        {
          name: "Apply for a Provisional License",
          url: "https://www.gov.uk/apply-first-provisional-driving-licence",
        },
        {
          name: "Renew Your License",
          url: "https://www.gov.uk/renew-driving-licence",
        },
      ],
    },
    {
      category: "Theory Test",
      icon: <FaBook className="text-4xl text-red-600 mb-4" />,
      items: [
        {
          name: "Book a Theory Test",
          url: "https://www.gov.uk/book-theory-test",
        },
        {
          name: "Prepare for the Theory Test",
          url: "https://www.gov.uk/theory-test/revision-and-practice",
        },
      ],
    },
    {
      category: "Practical Driving Test",
      icon: <FaCar className="text-4xl text-red-600 mb-4" />,
      items: [
        {
          name: "Book a Driving Test",
          url: "https://www.gov.uk/book-driving-test",
        },
        {
          name: "Find Driving Test Centers",
          url: "https://www.gov.uk/find-driving-test-centre",
        },
        {
          name: "Prepare for Practical Test",
          url: "https://readytopass.campaign.gov.uk/",
        },
      ],
    },
    {
      category: "Driving Test Preparation",
      icon: <FaCar className="text-4xl text-red-600 mb-4" />,
      items: [
        {
          name: "Show Me, Tell Me Questions",
          url: "https://www.gov.uk/government/publications/car-show-me-tell-me-vehicle-safety-questions",
        },
      ],
    },
    {
      category: "Driving Schools and Centers",
      icon: <FaSchool className="text-4xl text-red-600 mb-4" />,
      items: [
        {
          name: "Search for Approved Driving Instructors",
          url: "https://www.gov.uk/find-driving-schools-and-lessons",
        },
      ],
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-screen-lg mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Useful Links
        </h1>
        <p className="text-lg text-gray-700 text-center mb-12">
          Explore these helpful links to guide you through your driving journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {links.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center">
                {category.icon}
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {category.category}
                </h2>
              </div>
              <ul className="list-disc pl-6 space-y-4">
                {category.items.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 text-lg hover:underline"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
