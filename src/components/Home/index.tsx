import React from "react";
import Hero from "./Hero";
import Collections from "./Collections";
import PromoBanner from "./PromoBanner";
import Newsletter from "../Common/Newsletter";
import PriceSlider from "../Global/PriceSlider/PriceSlider";

const Home = () => {
  return (
    <main>
      <Hero />
      <PriceSlider />
      <Collections />
      <PromoBanner />
      <Newsletter />
    </main>
  );
};

export default Home;
