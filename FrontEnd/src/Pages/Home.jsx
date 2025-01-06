import React from "react";
import Header from "../Components/Header";
import Reviews from "../Components/reviews";
import WhyUs from "../Components/WhyUs";
import Badges from "../Components/Badges";
import Book from "../Components/Book";
import Faq from "../Components/Faq";
import AreaCover from "../Components/AreaCover";
import { Helmet } from "react-helmet-async";
// Home.jsx

const Home = () => {
  return (
    <>
    <Helmet>
        <title>360 Drive Academy - Learn to Drive with Confidence</title>
        <meta
          name="description"
          content="Welcome to 360 Drive Academy, where we offer expert driving lessons, test preparation, and flexible scheduling for learners of all levels. Learn to drive with confidence."
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="driving lessons, driving school, driving test, learn to drive, driving instructor, book driving lessons" />
        <link rel="canonical" href="https://www.360driveacademy.com/" />
      </Helmet>

      <Header />
      <WhyUs />
      <Book />
      <AreaCover />
      <Badges />
      <Reviews />
      <Faq />
    </>
  );
};

export default Home;
