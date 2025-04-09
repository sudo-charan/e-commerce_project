import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "../components/sliderBanner/Slider";
import ServiceWrapper from "../components/wrapper/serviceWrapper";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

// ✅ Sample fallback products
const sampleProducts = [
  {
    product_id: 1,
    name: "iPhone 14 Pro",
    price: 129999,
    category_id: 2,
    section: "Best Seller",
    image_url: "https://via.placeholder.com/150?text=iPhone+14+Pro",
    description: "A powerful phone with advanced features.",
    stock: 10,
  },
  {
    product_id: 2,
    name: "Samsung Galaxy S23",
    price: 74999,
    category_id: 2,
    section: "Best Deals",
    image_url: "https://via.placeholder.com/150?text=Galaxy+S23",
    description: "Flagship Android smartphone.",
    stock: 5,
  },
  {
    product_id: 3,
    name: "Boat Rockerz 255",
    price: 1299,
    category_id: 3,
    section: "New Arrivals",
    image_url: "https://via.placeholder.com/150?text=Boat+Rockerz",
    description: "Wireless Bluetooth neckband.",
    stock: 15,
  },
];

const Home = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/categories");
        const map = {};
        res.data.categories.forEach((cat) => {
          map[cat.category_name.toLowerCase()] = cat.category_id;
        });
        setCategoryMap(map);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!Object.keys(categoryMap).length) return;

      try {
        const res = await axios.get("http://localhost:5000/api/admin/products/all");
        const allProducts = [...sampleProducts, ...res.data];
        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(sampleProducts); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryMap]);

  // ✅ Event Handlers
  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return alert("Please login to add to cart");

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        user_id: userId,
        product_id: product.product_id,
        quantity: 1,
      });
      alert(`${product.name} added to cart.`);
    } catch (err) {
      console.error("Add to Cart error:", err);
      alert("Error adding to cart.");
    }
  };

  const handleAddToWishlist = async (product) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return alert("Please login to add to wishlist");

    try {
      await axios.post("http://localhost:5000/api/wishlist/add", {
        user_id: userId,
        product_id: product.product_id,
      });
      alert(`${product.name} added to wishlist.`);
    } catch (err) {
      console.error("Add to Wishlist error:", err);
      alert("Error adding to wishlist.");
    }
  };

  // ✅ Filter by selected category
  const filteredProducts = selectedCategory
    ? products.filter(
        (p) => p.category_id === categoryMap[selectedCategory.toLowerCase()]
      )
    : products;

  // ✅ Group by section
  const groupedBySection = filteredProducts.reduce((acc, product) => {
    const section = product.section || "Others";
    if (!acc[section]) acc[section] = [];
    acc[section].push(product);
    return acc;
  }, {});

  return (
    <div className="home-container">
      {/* Slider & Services only on home */}
      {!selectedCategory && (
        <>
          <Slider />
          <ServiceWrapper />
        </>
      )}

      {/* Loading & Empty States */}
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="no-products-text">No products found.</p>
      ) : selectedCategory ? (
        <div className="section-wrapper">
          <h2 className="section-title">{selectedCategory}</h2>
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isAdmin={false}
              />
            ))}
          </div>
        </div>
      ) : (
        Object.entries(groupedBySection).map(([sectionName, sectionProducts]) => (
          <div key={sectionName} className="section-wrapper">
            <h2 className="section-title">{sectionName}</h2>
            <div className="products-grid">
              {sectionProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  isAdmin={false}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
