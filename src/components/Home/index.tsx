import React from "react";
import Hero from "./Hero";
import Collections from "./Collections";
import PromoBanner from "./PromoBanner";
import Newsletter from "../Common/Newsletter";
import PriceSlider from "../Global/PriceSlider/PriceSlider";
import About from "./About";
import Blog from "./Blog";
import Divider from "../Common/Divider";
import HeroFeature from "./Hero/HeroFeature";

const Home = () => {
  return (
    <main>
      <Hero />
      {/* <!-- Hero features --> */}
      <HeroFeature />
      <Divider />
      <Collections />
      <Divider />
      <Blog />
      <Divider />
      <About />
    </main>
  );
};

export default Home;
