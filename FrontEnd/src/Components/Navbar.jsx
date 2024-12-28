import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom"; // Import useLocation
import logo from "../assets/360logo-nav.png";
import { Link } from "react-router-dom";
const navigation = [
  { name: "Home", href: "/" },
  { name: "Booking", href: "/Booking" },
  { name: "Contact us", href: "/Contact" },
  { name: "About us", href: "/About" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation(); // Get the current location (pathname)

  return (
    <Disclosure as="nav" className="bg-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-[8rem] items-center justify-between sm:[1rem] mobile:h-[5rem]">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-8 group-data-[open]:hidden text-red-600 hover:bg-red-700 font-bold"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-8 group-data-[open]:block bg-red-600 flex-2"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="flex 0 items-center">
              <img
                alt="Your Company"
                src={logo}
                className="xl:h-[10rem] xl:w-[15rem] w-[9rem] h-[7rem]"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="lg:flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={location.pathname === item.href ? "page" : undefined}  // Set active item
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-red-600 text-white"  // Apply the red background if it's the current page
                        : "text-black hover:bg-red-600 hover:text-white",
                      "rounded-md px-3 py-2 font-Poppins font-bold"
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

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={location.pathname === item.href ? "page" : undefined}  // Set active item for mobile
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
