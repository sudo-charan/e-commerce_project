import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./adminComponents/AdminSidebar";
import "./styles/ManageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSection, setFilterSection] = useState("");

  const [formData, setFormData] = useState({
    product_id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    section: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/products/all");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/categories");
      setCategories(res.data);
      console.log("Fetched categories:", res.data); // ✅ Debug log
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) form.append(key, formData[key]);
    }

    try {
      if (editing) {
        await axios.put(
          `http://localhost:3001/api/products/update/${formData.product_id}`,
          form
        );
      } else {
        await axios.post("http://localhost:3001/api/products/add", form);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id?.toString() || "", // Ensure string
      section: product.section || "",
      image: null,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/products/delete/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: null,
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      section: "",
      image: null,
    });
    setEditing(false);
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch = filterCategory
      ? product.category_id?.toString() === filterCategory
      : true;
    const sectionMatch = filterSection
      ? product.section === filterSection
      : true;
    return categoryMatch && sectionMatch;
  });

  return (
    <div className="manage-products-page">
      <AdminNavbar />
      <div className="manage-products-container">
        <h2>{editing ? "Edit Product" : "Add Product"}</h2>

        {/* ✅ Product Form */}
        <form
          className="product-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          {/* ✅ Category Dropdown */}
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id.toString()}>
                {cat.category_name}
              </option>
            ))}
          </select>

          {/* ✅ Section Dropdown */}
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
          >
            <option value="">Select Section (optional)</option>
            <option value="Best Seller">Best Seller</option>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Deals">Deals</option>
          </select>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="form-buttons full-width">
            <button type="submit">{editing ? "Update Product" : "Add Product"}</button>
            {editing && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ✅ Filters */}
        <div className="filters">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id.toString()}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
            <option value="">All Sections</option>
            <option value="Best Seller">Best Seller</option>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Deals">Deals</option>
          </select>
        </div>

        {/* ✅ Product List */}
        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <p>No products found for selected filters.</p>
          ) : (
            filteredProducts.map((product) => (
              <div className="product-item" key={product.product_id}>
                <img
                  src={`http://localhost:3001/productImgs/${product.image_url}`}
                  alt={product.name}
                />
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p>₹{product.price}</p>
                <p>Stock: {product.stock}</p>
                <p>Category ID: {product.category_id}</p>
                <p>Section: {product.section || "None"}</p>
                <div>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.product_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
