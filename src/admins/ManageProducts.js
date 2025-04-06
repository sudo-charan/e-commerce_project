import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './adminComponents/AdminSidebar'; // ✅ Ensure correct path
import './styles/ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category_id: '', image_url: ''
  });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products/all');
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/products/update/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/admin/products/add', formData);
      }
      setFormData({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (product) => {
    setEditId(product.product_id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      image_url: product.image_url,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar />

      <div className="manage-products">
        <h2>Manage Products</h2>

        <form onSubmit={handleSubmit} className="product-form">
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <input name="category_id" type="number" placeholder="Category ID" value={formData.category_id} onChange={handleChange} required />
          <input name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} required />
          <button type="submit">{editId ? 'Update' : 'Add'} Product</button>
        </form>

        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.product_id}>
                <td>{prod.product_id}</td>
                <td>{prod.name}</td>
                <td>₹{prod.price}</td>
                <td>{prod.stock}</td>
                <td>{prod.category_id}</td>
                <td>
                  <button onClick={() => handleEdit(prod)}>Edit</button>
                  <button onClick={() => handleDelete(prod.product_id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
