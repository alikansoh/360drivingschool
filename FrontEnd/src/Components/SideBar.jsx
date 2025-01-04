import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { GrUserSettings } from "react-icons/gr";
import { FcMissedCall } from "react-icons/fc";
import { LuPackageOpen } from "react-icons/lu";
import { BsFillCollectionPlayFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: <FcMissedCall size={25} className="mr-4" />,
      text: "Booking",
      url: "/admin/booking", // Ensure this matches location.pathname
    },
    {
      icon: <LuPackageOpen size={25} className="mr-4 " />,
      text: "Packages",
      url: "/admin/packages", // Add leading slash for consistency
    },
    {
      icon: <BsFillCollectionPlayFill size={25} className="mr-4" />,
      text: "Courses",
      url: "/admin/courses", // Add leading slash
    },
    {
      icon: <GrUserSettings size={25} className="mr-4" />,
      text: "User",
      url: "/admin/users", // Add leading slash
    },
  ];
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from localStorage
    navigate("/admin"); // Redirect to login page
  };

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
          360<span className="font-bold">drive Academy</span>
        </h1>
      </div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded-md"
        onClick={handleLogout}
      >
        Logout
      </button>
      {/* Mobile Menu */}
      {/* Overlay */}
      {nav && (
        <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
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
            {menuItems.map(({ icon, text, url }, index) => {
              return (
                <div key={index} className="py-4">
                  <Link to={url}>
                    <li
                      className={`${
                        location.pathname === url ? "bg-red-600 text-white" : ""
                      } text-xl flex cursor-pointer rounded-full mx-auto p-2 hover:text-white hover:bg-black`}
                    >
                      {icon} {text}
                    </li>
                  </Link>
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
