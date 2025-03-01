import { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar.jsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./Pages/Home.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "./Components/footer.jsx";
import Services from "./Pages/Services.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Pages/Login.jsx";
import SideBar from "./Components/SideBar.jsx";
import ScrollToTop from "./Components/ScrollToTop.js";
import FAQsPage from "./Pages/Faqs.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import PrivacyPolicy from "./Pages/privacyAndPolicy.jsx";
import UsefulLinks from "./Pages/UsefulLinks.jsx";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Book from "./Pages/AdminBooking.jsx";
import Courses from "./Pages/AdminCourses.jsx";
import Package from "./Pages/AdminPackages.jsx";
import AdminPage from "./Pages/AdminPage.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <section className="font-Poppins">
      <HelmetProvider>
        <BrowserRouter>
          <MainContent />
        </BrowserRouter>
      </HelmetProvider>
    </section>
  );
}

function MainContent() {
  const location = useLocation();

  // Check if the current route is the admin login page or any admin page
  const isLoginPage = location.pathname === "/admin";
  const isAdminPage = location.pathname.includes("/admin");

  return (
    <div className="">
      <ScrollToTop />

      {isAdminPage && <SideBar />}

      <div className="flex-1">
        {/* Routes with dynamic meta tags */}
        <Routes>
          <Route
            path="/"
            element={
              <PageMeta
                title="Home - 360 Drive Academy"
                description="Welcome to 360 Drive Academy. Learn to drive with expert instructors and flexible schedules."
              />
            }
          />
          <Route
            path="/courses"
            element={
              <PageMeta
                title="Courses - 360 Drive Academy"
                description="Explore our driving courses. From beginner lessons to advanced training, we offer the best driving education."
              />
            }
          />
          <Route
            path="/faqs"
            element={
              <PageMeta
                title="FAQs - 360 Drive Academy"
                description="Find answers to common questions about our driving academy, lessons, and services."
              />
            }
          />
          <Route
            path="/admin"
            element={
              <PageMeta
                title="Admin Login - 360 Drive Academy"
                description="Admin login page for 360 Drive Academy."
              />
            }
          />
          <Route
            path="/about-us"
            element={
              <PageMeta
                title="About Us - 360 Drive Academy"
                description="Learn more about 360 Drive Academy and our mission to provide quality driving lessons."
              />
            }
          />
          <Route
            path="/contact-us"
            element={
              <PageMeta
                title="Contact Us - 360 Drive Academy"
                description="Get in touch with 360 Drive Academy. Contact us for driving lessons, inquiries, and more."
              />
            }
          />
          <Route
            path="/privacy-and-Policy"
            element={
              <PageMeta
                title="Privacy Policy - 360 Drive Academy"
                description="Read our privacy policy to understand how we handle your data at 360 Drive Academy."
              />
            }
          />
          <Route
            path="/useful-Links"
            element={
              <PageMeta
                title="Useful Links - 360 Drive Academy"
                description="Check out useful links for driving test preparation, rules, and more."
              />
            }
          />
        </Routes>

        {/* Navbar and Footer */}
        {!isLoginPage && !isAdminPage && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<Services />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-and-Policy" element={<PrivacyPolicy />} />
          <Route path="/useful-Links" element={<UsefulLinks />} />

          {/* Protected Routes */}
          <Route
            path="/admin/booking"
            element={
              <PrivateRoute>
                <Book />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <PrivateRoute>
                <Package />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
        {!isLoginPage && !isAdminPage && <Footer />}
      </div>
      <ToastContainer />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

function PageMeta({ title, description }) {
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Example Alternate Tags */}
      <link rel="alternate" hreflang="en" href={`${window.location.origin}${window.location.pathname}`} />
      <link rel="alternate" hreflang="fr" href={`${window.location.origin}/fr${window.location.pathname}`} />
    </Helmet>
  );
}

export default App;
