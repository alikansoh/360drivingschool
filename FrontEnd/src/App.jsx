import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./Components/Navbar.jsx";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/Home.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/thumbs";
import "swiper/css/effect-coverflow";
import "swiper/css/mousewheel";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import Footer from "./Components/footer.jsx";
import Services from "./Pages/Services.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Pages/Login.jsx";
import SideBar from "./Components/SideBar.jsx";
import ScrollToTop from "./Components/ScrollToTop.js";
import FAQsPage from "./Pages/Faqs.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
function App() {
  return (
    <section className="font-Poppins">
      <BrowserRouter>
        <MainContent />
      </BrowserRouter>
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
        {!isLoginPage && !isAdminPage && <Navbar />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<Services />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/aboutUs" element={<AboutUs />} />
        </Routes>

        {!isLoginPage && !isAdminPage && <Footer />}
      </div>
    </div>
  );
}

export default App;
