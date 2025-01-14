import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom"; // Import useLocation
import logo from "../assets/360logo-nav.png";
import { Link } from "react-router-dom";

// Navigation links
const navigation = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About us", href: "/about-us" },
  { name: "Contact us", href: "/contact-us" },
  { name: "Useful Links", href: "/useful-links" },
];

// Helper function to join classes
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation(); // Get tEmailhe current location (pathname)

  return (
    <Disclosure as="nav" className="bg-gray-300">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-[10rem] sm:h-[9rem] mobile:h-[6rem]">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white focus:outline-none  ">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-8 w-8 group-data-[open]:hidden text-red-600 hover:bg-red-700 font-bold"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-8 w-8 group-data-[open]:block bg-red-600"
              />
            </DisclosureButton>
          </div>

          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center">
              <Link to="/">
                <img
                  alt="Your Company"
                  src={logo}
                  className="xl:h-[10rem] xl:w-[15rem] w-[9rem] h-[7rem] mobile:w-[11rem] mobile:h-[8rem]"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="lg:flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={
                      location.pathname === item.href ? "page" : undefined
                    }
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-red-600 text-white"
                        : "text-black hover:bg-red-600 hover:text-white",
                      "rounded-md px-3 py-2 font-Poppins font-bold tablet:text-sm tablet:px-2"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text under 'Contact Us' link */}

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link} // Use Link instead of 'a'
              to={item.href}
              aria-current={
                location.pathname === item.href ? "page" : undefined
              }
              className={classNames(
                location.pathname === item.href
                  ? "bg-red-600 text-white"
                  : "text-black hover:bg-red-300 hover:text-black",
                "block rounded-md px-3 py-2 text-base"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
