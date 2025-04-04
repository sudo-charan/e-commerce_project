import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CategoryNav from "./components/CategoryNav";
import Home from "./pages/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./components/Profile";
import Orders from "./pages/Orders.js";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <CategoryNav setSelectedCategory={setSelectedCategory} />
            <Routes>
                <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
                <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
        </Router>
    );
};

export default App;
