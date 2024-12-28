import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { GrUserSettings } from "react-icons/gr";
import { FcMissedCall } from "react-icons/fc";
import { LuPackageOpen } from "react-icons/lu";
import { BsFillCollectionPlayFill } from "react-icons/bs";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const menuItems = [
    { icon: <FcMissedCall size={25} className="mr-4" />, text: "Call request" },
    {
      icon: <LuPackageOpen size={25} className="mr-4 " />,
      text: "Packages",
    },
    {
      icon: <BsFillCollectionPlayFill size={25} className="mr-4" />,
      text: "Courses",
    },
    { icon: <GrUserSettings size={25} className="mr-4" />, text: "User" },
  ];

  return (
    <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4 shadow-sm">
      {/* Left side */}
      <div className="flex items-center">
        <div
          onClick={() => setNav(!nav)}
          className="cursor-pointer text-red-600"
        >
          <AiOutlineMenu size={30} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2 text-red-600">
          360<span className="font-bold">driving school</span>
        </h1>
      </div>

      {/* Mobile Menu */}
      {/* Overlay */}
      {nav ? (
        <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
      ) : (
        ""
      )}

      {/* Side drawer menu */}
      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300"
            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300"
        }
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute right-4 top-4 cursor-pointer text-red-600"
        />
        <h2 className="text-2xl p-4 text-red-600">
          360 <span className="font-bold text-red-600">Driving School</span>
        </h2>
        <nav>
          <ul className="flex flex-col p-4 text-red-600">
            {menuItems.map(({ icon, text }, index) => {
              return (
                <div key={index} className=" py-4">
                  <li className="text-xl flex cursor-pointer   rounded-full mx-auto p-2 hover:text-white hover:bg-black">
                    {icon} {text}
                  </li>
                </div>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
