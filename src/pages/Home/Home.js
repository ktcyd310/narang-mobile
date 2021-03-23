import React from "react";
import {
  HeroSlider,
  CategorySlider,
  EventList,
  AllProducts
} from "../../components";

const Home = () => {
  return (
    <div className="body-wrapper space-pt--70 space-pb--120">
      {/* hero slider */}
      <HeroSlider />
      {/* category slider */}
      <div>
      </div>
      {/*<CategorySlider />*/}
      {/* best seller products */}
      <EventList limit="4" eventCategory="event01_list" />
      <EventList limit="4" eventCategory="event02_list" />

        {/* all products */}
      {/*<AllProducts limit="12" />*/}
    </div>
  );
};

export default Home;
