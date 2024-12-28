import React from "react";
import area from "../assets/area.jpg";

const AreaCover = () => {
  const areas = [
    "Pinner",
    "Harrow",
    "South Harrow",
    "Ruslip",
    "Greenford",
    "Wembley",
    "Hendon",
    "Mill Hill",
    "Southhall",
    "Borehamwood",
    "Acton",
    "Alperton",
    "Stanmore",
  ];
  return (
    <section className="bg-[url('./assets/area.jpg')]  bg-center bg-no-repeat mt-20 border-2 border-gray-500 ">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mt-5 text-mobile:text-2xl animate-fade-in">
          Areas we cover?
        </h1>
        <p className="text-lg text-gray-600 mt-3 text-mobile:text-md animate-fade-in">
          We cover a wide range of areas, including but not limited to:
        </p>
        <ul className="text-lg font-semibold flex gap-10 flex-wrap justify-center items-center p-9 md:gap-8 mobile:gap-5  animate-fade-in-delayed">
          {areas.map((area) => (
            <li
              key={area}
              className="border-2 border-gray-600 px-7 py-2 rounded-md hover:bg-red-600 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out md:px-4 md:py-1 mobile:px-2 mobile:py-1 mobile:text-sm shadow-lg"
            >
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AreaCover;
