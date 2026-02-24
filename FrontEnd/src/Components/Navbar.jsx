import React, { Fragment, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useLocation, Link } from "react-router-dom";
import logo from "../assets/360logo-nav.png";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About us", href: "/about-us" },
  { name: "Contact us", href: "/contact-us" },
  { name: "Useful Links", href: "/useful-links" },
  { name: "Blog", href: "/blog" },
];

const areas = [
  { name: "Pinner", href: "/areas/pinner" },
  { name: "Harrow", href: "/areas/harrow" },
  { name: "Ruislip", href: "/areas/ruislip" },
  { name: "Greenford", href: "/areas/greenford" },
  { name: "Wembley", href: "/areas/wembley" },
  { name: "Hendon", href: "/areas/hendon" },
  { name: "Mill Hill", href: "/areas/mill-hill" },
  { name: "Southall", href: "/areas/southall" },
  { name: "Borehamwood", href: "/areas/borehamwood" },
  { name: "Ealing", href: "/areas/ealing" },
  { name: "Alperton", href: "/areas/alperton" },
  { name: "Stanmore", href: "/areas/stanmore" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();

  // Close the mobile Disclosure when the route changes
  useEffect(() => {
    try {
      // Headless UI Disclosure toggle sets aria-expanded on the button.
      // Find any Disclosure toggle within the <nav> that is expanded and click it to close.
      const openButton = document.querySelector('nav button[aria-expanded="true"]');
      if (openButton) openButton.click();
    } catch (e) {
      // fail silently
    }
  }, [location.pathname]);

  return (
    <Disclosure
      as="nav"
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center h-[5rem] sm:h-[7rem] lg:h-[10rem]">

              {/* ── MOBILE / TABLET hamburger ── */}
              <div className="absolute left-0 flex items-center lg:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-all duration-300">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* ── MOBILE / TABLET: centred logo (increased slightly) ── */}
              <div className="absolute inset-0 flex items-center justify-center lg:hidden pointer-events-none">
                <Link to="/" className="pointer-events-auto group">
                  <img
                    alt="Company Logo"
                    src={logo}
                    // Increased mobile logo size slightly: h-[5.25rem] -> sm:h-[6rem]
                    className="h-[5.25rem] sm:h-[6rem] w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                  />
                </Link>
              </div>

              {/* ── DESKTOP layout (lg+) ── */}
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
                <Link to="/" className="group flex-shrink-0">
                  <img
                    alt="Company Logo"
                    src={logo}
                    className="h-[8rem] xl:h-[10rem] w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                  />
                </Link>

                <div className="flex items-center space-x-2 xl:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={location.pathname === item.href ? "page" : undefined}
                      className={classNames(
                        location.pathname === item.href
                          ? "bg-red-600 text-white shadow-lg scale-105"
                          : "text-gray-800 hover:bg-red-600 hover:text-white hover:shadow-md hover:scale-105",
                        "rounded-lg px-3 py-2 xl:px-4 xl:py-2.5 font-Poppins font-semibold text-sm transition-all duration-300 relative overflow-hidden group whitespace-nowrap"
                      )}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {location.pathname !== item.href && (
                        <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                      )}
                    </Link>
                  ))}

                  {/* Areas dropdown */}
                  <Menu as="div" className="relative inline-block text-left">
                    {({ open: menuOpen }) => (
                      <>
                        <MenuButton
                          className={classNames(
                            location.pathname.startsWith("/areas")
                              ? "bg-red-600 text-white shadow-lg scale-105"
                              : "text-gray-800 hover:bg-red-600 hover:text-white hover:shadow-md hover:scale-105",
                            "rounded-lg px-3 py-2 xl:px-4 xl:py-2.5 font-Poppins font-semibold text-sm inline-flex items-center gap-2 transition-all duration-300 relative overflow-hidden group whitespace-nowrap"
                          )}
                        >
                          <span className="relative z-10">Covered Areas</span>
                          <ChevronDownIcon
                            className={classNames(
                              menuOpen ? "rotate-180" : "",
                              "h-4 w-4 transition-transform duration-300 relative z-10"
                            )}
                            aria-hidden="true"
                          />
                          {!location.pathname.startsWith("/areas") && (
                            <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                          )}
                        </MenuButton>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <MenuItems className="absolute right-0 z-10 mt-3 w-64 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none max-h-96 overflow-y-auto">
                            <div className="py-2">
                              {areas.map((area, index) => (
                                <MenuItem key={area.name}>
                                  {({ focus }) => (
                                    <Link
                                      to={area.href}
                                      className={classNames(
                                        focus || location.pathname === area.href
                                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                                          : "text-gray-800 hover:bg-gray-50",
                                        "block px-5 py-3 text-sm font-Poppins font-medium transition-all duration-200 border-l-4 border-transparent hover:border-red-600",
                                        location.pathname === area.href && "border-red-600"
                                      )}
                                      style={{ animationDelay: `${index * 20}ms` }}
                                    >
                                      {area.name}
                                    </Link>
                                  )}
                                </MenuItem>
                              ))}
                            </div>
                          </MenuItems>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE + TABLET menu panel ── */}
          <DisclosurePanel className="lg:hidden border-t border-gray-100 bg-white shadow-xl">
            <div className="px-3 pt-4 pb-5">

              <p className="px-4 pb-2 text-[10px] font-Poppins font-semibold uppercase tracking-widest text-gray-400">
                Navigation
              </p>

              <div className="sm:grid sm:grid-cols-2 sm:gap-x-3 space-y-0.5 sm:space-y-0">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-red-50 text-red-600 border-l-4 border-red-600 font-semibold"
                          : "text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:text-red-600 hover:border-red-400",
                        "flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-Poppins font-medium transition-all duration-200 w-full"
                      )}
                    >
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0" />
                      )}
                      <span className={classNames(!isActive && "ml-[18px]")}>
                        {item.name}
                      </span>
                    </DisclosureButton>
                  );
                })}
              </div>

              {/* Divider + Areas label */}
              <div className="mt-4 mb-2 px-4 flex items-center gap-2">
                <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-[10px] font-Poppins font-semibold uppercase tracking-widest text-gray-400">
                  Covered Areas
                </p>
              </div>

              {/* Areas accordion */}
              <Disclosure as="div">
                {({ open: areasOpen }) => {
                  const areasActive = location.pathname.startsWith("/areas");
                  return (
                    <>
                      <DisclosureButton
                        className={classNames(
                          areasActive
                            ? "bg-red-50 text-red-600 border-l-4 border-red-600 font-semibold"
                            : "text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:text-red-600 hover:border-red-400",
                          "flex w-full items-center justify-between rounded-r-lg px-4 py-3 text-sm font-Poppins font-medium transition-all duration-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {areasActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0" />
                          )}
                          <span className={classNames(!areasActive && "ml-[18px]")}>
                            Select an area
                          </span>
                        </div>
                        <ChevronDownIcon
                          className={classNames(
                            areasOpen ? "rotate-180" : "",
                            "h-4 w-4 transition-transform duration-300 text-gray-400"
                          )}
                        />
                      </DisclosureButton>

                      <DisclosurePanel>
                        <div className="mt-2 mb-1 ml-4 mr-1 grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-52 overflow-y-auto pr-1">
                          {areas.map((area) => {
                            const areaActive = location.pathname === area.href;
                            return (
                              <DisclosureButton
                                key={area.name}
                                as={Link}
                                to={area.href}
                                className={classNames(
                                  areaActive
                                    ? "bg-red-600 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white",
                                  "rounded-lg px-3 py-2 text-xs font-Poppins font-medium text-center transition-all duration-200"
                                )}
                              >
                                {area.name}
                              </DisclosureButton>
                            );
                          })}
                        </div>
                      </DisclosurePanel>
                    </>
                  );
                }}
              </Disclosure>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}