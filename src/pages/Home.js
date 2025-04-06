import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "../components/sliderBanner/Slider";
import ServiceWrapper from "../components/wrapper/serviceWrapper";
import "../styles/Home.css";

const Home = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Filter products by selected category (if any)
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category === selectedCategory
      )
    : products;

  return (
    <div className="home-container">
      {!selectedCategory && (
        <>
          <Slider />
          <ServiceWrapper />
        </>
      )}
      <h2>{selectedCategory ? `${selectedCategory} Products` : "All Products"}</h2>
      <div className="products">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p className="price">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
