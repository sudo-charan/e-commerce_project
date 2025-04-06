import React, { useEffect, useState } from "react";
import SlideCard from "./SlideCard";
import "./SlideCard.css";

const sliderData = [
  {
    title: "50% Off For Your First Shopping",
    desc: "Continue Shopping",
    cover: "/assets/hero-img.png",
  },
  {
    title: "50% Off For Your First Shopping",
    desc: "Continue Shopping",
    cover: "/assets/hero-headphone.png",
  },
  {
    title: "50% Off For Your First Shopping",
    desc: "Continue Shopping",
    cover: "/assets/hero-watch.png",
  },
  {
    title: "50% Off For Your First Shopping",
    desc: "Continue Shopping",
    cover: "/assets/hero-mobile.png",
  },
];

const Slider = () => {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimate(true); // Start the slide animation

      // Wait for animation to complete before switching slide
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % sliderData.length);
        setAnimate(false); // Reset animation flag
      }, 300); // Match with animation duration
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="homeSlide">
      <SlideCard
        {...sliderData[index]}
        className={animate ? "slide-in" : ""}
      />
    </div>
  );
};

export default Slider;
