import React from "react";
import "../styles/CategoryNavbar.css";

// ✅ Ensure these category names match exactly with those in your DB
const categories = [
  { name: "Home", image: "/assets/home-icon.png" },
  { name: "Mobiles", image: "/assets/22fddf3c7da4c4f4.png" },
  { name: "Fashion", image: "/assets/0d75b34f7d8fbcb3.png" },
  { name: "Electronics", image: "/assets/69c6589653afdb9a.png" },
  { name: "Home & Furniture", image: "/assets/ab7e2b022a4587dd.jpg" },
  { name: "Appliances", image: "/assets/0139228b2f7eb413.webp" },
  { name: "Beauty, Toys & More", image: "/assets/dff3f7adcf3a90c6.png" },
  { name: "Two Wheelers", image: "/assets/05d708653beff580.png" },
];

const CategoryNav = ({ setSelectedCategory, selectedCategory }) => {
  const handleClick = (categoryName) => {
    setSelectedCategory(categoryName === "Home" ? null : categoryName);
  };

  return (
    <nav className="category-navbar1">
      {categories.map((category, index) => (
        <button
          key={index}
          className={`category-item1 ${
            selectedCategory === category.name ? "active" : ""
          }`}
          onClick={() => handleClick(category.name)}
        >
          <img
            src={process.env.PUBLIC_URL + category.image}
            alt={category.name}
            className="category-icon"
          />
          <span className="category-name">{category.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default CategoryNav;