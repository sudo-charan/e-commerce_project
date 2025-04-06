import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import CategoryNav from "./components/CategoryNav";
import Home from "./pages/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Profile from "./components/Profile";

// Admin pages
import AdminDashboard from "./admins/AdminDashboard";
import ManageUsers from "./admins/ManageUsers";
import ManageProducts from "./admins/ManageProducts";
import ManageOrders from "./admins/ManageOrders";
import ManagePayments from "./admins/ManagePayments";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const openModal = () => setShowProfile(true);
    window.addEventListener("openProfileModal", openModal);
    return () => window.removeEventListener("openProfileModal", openModal);
  }, []);

  return (
    <>
      {!isAdminRoute && (
        <>
          <Navbar
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            setSelectedCategory={setSelectedCategory}
          />
          <CategoryNav setSelectedCategory={setSelectedCategory} />
        </>
      )}

      <Routes>
        {/* User routes */}
        <Route
          path="/"
          element={<Home selectedCategory={selectedCategory} />}
        />
        <Route
          path="/signin"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={<SignUp setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/payments" element={<ManagePayments />} />
      </Routes>

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
