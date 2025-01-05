"use client";
import React, { useEffect } from "react";
import HomeButtons from "./HomeButtons";
import Video from "./Video";
import ThankList from "../thanks/ThankList";
import About from "../about/About";

const Homepage = () => {
  // Automatically scrolls down after the page loads
  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  }, []);

  // Scrolls to the next section when called
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="relative flex flex-col justify-center sm:flex-row sm:justify-between items-center w-full">
        <Video />
        <button
          onClick={scrollToNextSection}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-secondary bg-transparent hover:scale-110 transition-all animate-updown sm:bottom-4 md:bottom-36 lg:bottom-16"
        >
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-primary max-w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M12 4v16M5 13l7 7 7-7" />
          </svg>
        </button>
      </div>
      <div
        id="next-section"
        className="mt-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 w-full flex flex-col items-center"
      >
        <HomeButtons />
        <About />
        <ThankList />
      </div>
    </div>
  );
};

export default Homepage;
