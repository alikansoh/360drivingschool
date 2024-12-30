import React from "react";
import drivegov from "../assets/drivegov.png";
import passplus from "../assets/passplace.png";
import easydrive from "../assets/easydrive.png";
import grade from "../assets/grade.png";
import instractor from "../assets/instructor.png";
const Badges = () => {
  return (
    <section className="flex justify-center items-center gap-20 mt-20 mobile:flex-wrap tablet:gap-8 mobile:gap-9 ">
      <a href="https://www.gov.uk/government/organisations/driver-and-vehicle-standards-agency">
        <img
          src={drivegov}
          alt="drivegov"
          className="w-[9rem]  mobile:w-25 mobile:w-[8rem] mobile:h-[6rem] "
        />
      </a>
      <a href="https://www.gov.uk/pass-plus">
        <img
          src={passplus}
          alt="passplus"
          className="w-[9rem] h-15 mobile:w-25 mobile:w-[6rem] mobile:h-[6rem]"
        />
      </a>
      <a href="https://www.gov.uk/government/publications/driving-instructor-grades-explained/driving-instructor-grades-explained">
        <img
          src={grade}
          alt="grade"
          className="w-[9rem] h-15 mobile:w-25 mobile:w-[6rem] mobile:h-[6rem]"
        />
      </a>
      <a href="https://www.gov.uk/government/publications/driving-instructor-grades-explained/driving-instructor-grades-explained">
        <img
          src={instractor}
          alt="instractor"
          className="w-[9rem] h-15 mobile:w-[6rem] mobile:h-[6rem]"
        />
      </a>
    </section>
  );
};

export default Badges;
