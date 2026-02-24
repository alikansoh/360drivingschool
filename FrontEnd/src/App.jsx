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
import Pinner from "./Pages/Pinner.jsx";
import Ealing from "./Pages/Ealing.jsx";
import Greenford from "./Pages/Greenford.jsx";
import Wembley from "./Pages/Wembley.jsx";
import Harrow from "./Pages/Harrow.jsx";
import Ruislip from "./Pages/Ruislip.jsx";
import Hendon from "./Pages/Hendon.jsx";
import MillHill from "./Pages/MillHill.jsx";
import Southall from "./Pages/Southall.jsx";
import Borehamwood from "./Pages/Borehamwood.jsx";
import Alperton from "./Pages/Alperton.jsx";
import Stanmore from "./Pages/Stanmore.jsx";
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
import BlogPage from "./Pages/AdminBlogs.jsx"; // admin blog manager
import PublicBlogList from "./Pages/Blog.jsx"; // public blog listing
import PublicBlogPost from "./Pages/BlogItem.jsx"; // public single post

import FloatingActions from "./Components/FloatingActions.jsx";

const DEFAULT_PHONE = "+447789471859";

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

          {/* Area-specific meta routes */}
          <Route path="/pinner" element={<PinnerMeta />} />
          <Route
            path="/ealing"
            element={
              <PageMeta
                title="Driving Lessons in Ealing W5 | 360 Drive Academy"
                description="Looking for driving lessons in Ealing, W5? 360 Drive Academy offers DVSA-approved instructors, intensive courses, motorway lessons and mock tests. Book now."
              />
            }
          />
          <Route path="/greenford" element={<GreenfordMeta />} />
          <Route path="/wembley" element={<WembleyMeta />} />
          <Route path="/harrow" element={<HarrowMeta />} />
          <Route path="/ruislip" element={<RuislipMeta />} />
          <Route path="/hendon" element={<HendonMeta />} />
          <Route path="/mill-hill" element={<MillHillMeta />} />
          <Route path="/southall" element={<SouthallMeta />} />
          <Route path="/borehamwood" element={<BorehamwoodMeta />} />
          <Route path="/alperton" element={<AlpertonMeta />} />
          <Route path="/stanmore" element={<StanmoreMeta />} />
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
          <Route path="areas/pinner" element={<Pinner />} />
          <Route path="areas/ealing" element={<Ealing />} />
          <Route path="areas/greenford" element={<Greenford />} />
          <Route path="areas/wembley" element={<Wembley />} />
          <Route path="areas/harrow" element={<Harrow />} />
          <Route path="areas/ruislip" element={<Ruislip />} />
          <Route path="areas/hendon" element={<Hendon />} />
          <Route path="areas/mill-hill" element={<MillHill />} />
          <Route path="areas/southall" element={<Southall />} />
          <Route path="areas/borehamwood" element={<Borehamwood />} />
          <Route path="areas/alperton" element={<Alperton />} />
          <Route path="areas/stanmore" element={<Stanmore />} />
          <Route path="/privacy-and-Policy" element={<PrivacyPolicy />} />
          <Route path="/useful-Links" element={<UsefulLinks />} />

          {/* Public blog routes */}
          <Route path="/blog" element={<PublicBlogList />} />
          <Route path="/blog/:slug" element={<PublicBlogPost />} />

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

          {/* Admin blog management */}
          <Route
            path="/admin/blogs"
            element={
              <PrivateRoute>
                <BlogPage />
              </PrivateRoute>
            }
          />
        </Routes>

        {!isLoginPage && !isAdminPage && <Footer />}

        {/* Floating actions present site-wide (on all pages) */}
        <FloatingActions phone={DEFAULT_PHONE.replace(/^\+/, "")} />
      </div>

      <ToastContainer />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

/* Generic page meta (used for many simple pages) */
function PageMeta({ title, description }) {
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${window.location.origin}/og-image.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}

/* Reusable meta helper for areas (keeps consistent schema + phone) */
function buildAreaMeta({ slug, title, description, keywords, areaName }) {
  const canonicalUrl = `${window.location.origin}/${slug}`;
  const image = `${window.location.origin}/og-image.jpg`;
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: "360 Drive Academy",
    description,
    image,
    telephone: DEFAULT_PHONE,
    url: canonicalUrl,
    areaServed: { "@type": "City", name: areaName },
    address: { "@type": "PostalAddress", addressLocality: areaName, addressCountry: "GB" },
    openingHours: ["Mo-Su 07:00-21:00"],
    sameAs: [],
  };
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: "en-GB",
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:site_name" content="360 Drive Academy" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webpageSchema)}</script>

      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
    </Helmet>
  );
}

/* Area meta wrappers */
function PinnerMeta() {
  return buildAreaMeta({
    slug: "pinner",
    title: "Pinner Driving Lessons — UB5 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Pinner with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Flexible scheduling across Pinner — book online or call to get started.",
    keywords:
      "driving lessons pinner, driving instructor pinner, automatic lessons pinner, intensive driving course pinner, mock test pinner, motorway lessons pinner",
    areaName: "Pinner",
  });
}
function GreenfordMeta() {
  return buildAreaMeta({
    slug: "greenford",
    title: "Greenford Driving Lessons — UB6 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Greenford (UB6) with DVSA-approved instructors. Beginner lessons, automatic & manual tuition, intensive courses, motorway practice and mock tests. Book online or call to get started.",
    keywords:
      "driving lessons greenford, driving instructor greenford, automatic lessons greenford, intensive course greenford, mock test greenford",
    areaName: "Greenford",
  });
}
function WembleyMeta() {
  return buildAreaMeta({
    slug: "wembley",
    title: "Wembley Driving Lessons — HA9 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Wembley (HA9) with DVSA-approved instructors. Beginner lessons, automatic & manual tuition, intensive courses, motorway practice and mock tests. Book online or call to get started.",
    keywords:
      "driving lessons wembley, driving instructor wembley, automatic lessons wembley, intensive course wembley, mock test wembley",
    areaName: "Wembley",
  });
}
function HarrowMeta() {
  return buildAreaMeta({
    slug: "harrow",
    title: "Harrow Driving Lessons — HA1 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Harrow (HA1) with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons harrow, driving instructor harrow, automatic lessons harrow, intensive course harrow, mock test harrow",
    areaName: "Harrow",
  });
}
function RuislipMeta() {
  return buildAreaMeta({
    slug: "ruislip",
    title: "Ruislip Driving Lessons — HA4 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Ruislip (HA4) with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons ruislip, driving instructor ruislip, automatic lessons ruislip, intensive course ruislip, mock test ruislip",
    areaName: "Ruislip",
  });
}
function HendonMeta() {
  return buildAreaMeta({
    slug: "hendon",
    title: "Hendon Driving Lessons — NW4 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Hendon (NW4) with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons hendon, driving instructor hendon, automatic lessons hendon, intensive course hendon, mock test hendon",
    areaName: "Hendon",
  });
}
function MillHillMeta() {
  return buildAreaMeta({
    slug: "mill-hill",
    title: "Mill Hill Driving Lessons — NW7 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Mill Hill (NW7) with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons mill hill, driving instructor mill hill, automatic lessons mill hill, intensive course mill hill, mock test mill hill",
    areaName: "Mill Hill",
  });
}
function SouthallMeta() {
  return buildAreaMeta({
    slug: "southall",
    title: "Southall Driving Lessons — UB2 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Southall (UB2) with DVSA-approved instructors. Beginner lessons, automatic & manual tuition, intensive courses, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons southall, driving instructor southall, automatic lessons southall, intensive course southall",
    areaName: "Southall",
  });
}
function BorehamwoodMeta() {
  return buildAreaMeta({
    slug: "borehamwood",
    title: "Borehamwood Driving Lessons — WD6 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Borehamwood (WD6) with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons borehamwood, driving instructor borehamwood, automatic lessons borehamwood, intensive course borehamwood",
    areaName: "Borehamwood",
  });
}
function AlpertonMeta() {
  return buildAreaMeta({
    slug: "alperton",
    title: "Alperton Driving Lessons — HA0 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Alperton (HA0) with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons alperton, driving instructor alperton, automatic lessons alperton, intensive course alperton",
    areaName: "Alperton",
  });
}
function StanmoreMeta() {
  return buildAreaMeta({
    slug: "stanmore",
    title: "Stanmore Driving Lessons — HA7 Local Instructors | 360 Drive Academy",
    description:
      "Driving lessons in Stanmore (HA7) with DVSA-approved instructors. Beginner lessons, intensive courses, automatic & manual tuition, motorway practice and mock tests. Book online or call to get started.",
    keywords: "driving lessons stanmore, driving instructor stanmore, automatic lessons stanmore, intensive course stanmore",
    areaName: "Stanmore",
  });
}

export default App;