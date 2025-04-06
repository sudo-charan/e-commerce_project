import React from "react";
import "../wrapper/Wrapper.css";
import { Truck, Lock, RefreshCcw, Headphones } from "lucide-react";

const ServiceWrapper = () => {
  return (
    <section className="wrapper background">
      <div className="wrapper-container">
        <div className="feature" style={{ backgroundColor: "#fceec0" }}>
          <div className="icon"><Truck size={20} /></div>
          <h3>Free Delivery</h3>
          <p>On all orders</p>
        </div>
        <div className="feature" style={{ backgroundColor: "#d4f1f4" }}>
          <div className="icon"><Lock size={20} /></div>
          <h3>Secure Payment</h3>
          <p>100% secure payment</p>
        </div>
        <div className="feature" style={{ backgroundColor: "#f0d9ff" }}>
          <div className="icon"><RefreshCcw size={20} /></div>
          <h3>Easy Returns</h3>
          <p>10 days return policy</p>
        </div>
        <div className="feature" style={{ backgroundColor: "#e0f7fa" }}>
          <div className="icon"><Headphones size={20} /></div>
          <h3>24/7 Support</h3>
          <p>Dedicated support</p>
        </div>
      </div>
    </section>
  );
};

export default ServiceWrapper;
