import React from "react";
import Header from "../Components/Header";
import Reviews from "../Components/reviews";
import WhyUs from "../Components/WhyUs";
import Badges from "../Components/Badges";
import Book from "../Components/Book";
import Faq from "../Components/Faq";
import AreaCover from "../Components/AreaCover";
// Home.jsx

const Home = () => {
  return (
    <>
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
