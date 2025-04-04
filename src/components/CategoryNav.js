import React from "react";
import "../styles/CategoryNavbar.css";

const categories = [
    { name: "Home", image: "/assets/home-icon.png" },
    { name: "Mobiles", image: "/assets/22fddf3c7da4c4f4.png" },
    { name: "Fashion", image: "/assets/0d75b34f7d8fbcb3.png" },
    { name: "Electronics", image: "/assets/69c6589653afdb9a.png" },
    { name: "Home & Furniture", image: "/assets/ab7e2b022a4587dd.jpg" },
    { name: "Appliances", image: "/assets/0139228b2f7eb413.webp" },
    { name: "Beauty, Toys & More", image: "/assets/dff3f7adcf3a90c6.png" },
    { name: "Two Wheelers", image: "/assets/05d708653beff580.png" }
];

const CategoryNavbar = ({ setSelectedCategory }) => {
    return (
        <nav className="category-navbar">
            {categories.map((category, index) => (
                <button 
                    key={index} 
                    className="category-item" 
                    onClick={() => setSelectedCategory(category.name === "Home" ? null : category.name)}
                >
                    <img src={process.env.PUBLIC_URL + category.image} alt={category.name} />
                    <span>{category.name}</span>
                </button>
            ))}
        </nav>
    );
};

export default CategoryNavbar;
