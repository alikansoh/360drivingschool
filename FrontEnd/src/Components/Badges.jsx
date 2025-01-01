import React from "react";
import drivegov from "../assets/drivegov.png";
import passplus from "../assets/passplace.png";
import grade from "../assets/grade.png";
import instractor from "../assets/instructor.png";

const Badges = () => {
  return (
    <section
      className="flex flex-wrap justify-center items-center gap-8 mt-20"
      aria-labelledby="badges-section" // Accessibility: Added section label
    >
      <h2 id="badges-section" className="sr-only">Badges and Certifications</h2> {/* SEO: Hidden but accessible heading for search engines */}

      {/* Drivegov Badge */}
      <a
        href="https://www.gov.uk/government/organisations/driver-and-vehicle-standards-agency"
        className="flex justify-center items-center"
        aria-label="Visit the official Driver and Vehicle Standards Agency (DVSA) page"
      >
        <img
          src={drivegov}
          alt="Drive.gov official certification for driver services"
          className="w-[9rem] h-[9rem] mobile:w-[6rem] tablet:w-[8rem] tablet:h-[8rem] lg:w-[9rem] lg:h-[9rem] object-contain transition-all duration-300 hover:scale-105"
        />
      </a>

      {/* Pass Plus Badge */}
      <a
        href="https://www.gov.uk/pass-plus"
        className="flex justify-center items-center"
        aria-label="Learn more about the Pass Plus scheme"
      >
        <img
          src={passplus}
          alt="Pass Plus certification for advanced driving"
          className="w-[9rem] h-[9rem] mobile:w-[6rem] tablet:w-[8rem] tablet:h-[8rem] lg:w-[9rem] lg:h-[9rem] object-contain transition-all duration-300 hover:scale-105"
        />
      </a>

      {/* Grade Badge */}
      <a
        href="https://www.gov.uk/government/publications/driving-instructor-grades-explained/driving-instructor-grades-explained"
        className="flex justify-center items-center"
        aria-label="Learn about driving instructor grades"
      >
        <img
          src={grade}
          alt="Instructor grade certification and qualification"
          className="w-[9rem] h-[9rem] mobile:w-[6rem] tablet:w-[8rem] tablet:h-[8rem] lg:w-[9rem] lg:h-[9rem] object-contain transition-all duration-300 hover:scale-105"
        />
      </a>

      {/* Instructor Badge */}
      <a
        href="https://www.gov.uk/government/publications/driving-instructor-grades-explained/driving-instructor-grades-explained"
        className="flex justify-center items-center"
        aria-label="Instructor certification and grades explained"
      >
        <img
          src={instractor}
          alt="Instructor certification for driving schools"
          className="w-[9rem] h-[9rem] mobile:w-[6rem] tablet:w-[8rem] tablet:h-[8rem] lg:w-[9rem] lg:h-[9rem] object-contain transition-all duration-300 hover:scale-105"
        />
      </a>
    </section>
  );
};

export default Badges;
