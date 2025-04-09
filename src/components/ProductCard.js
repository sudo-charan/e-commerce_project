import React from "react";
import "../styles/ProductCard.css";

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };

  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product.product_id);
    }
  };

  return (
    <div className="product-card">
      <img
        src={`/productImgs/${product.image_url}`}
        alt={product.name}
        className="product-img"
      />
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">₹{product.price}</p>
        <p className="product-stock">
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>
      </div>
      <div className="product-actions">
        {!isAdmin && (
          <>
            <button className="btn-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-wishlist" onClick={handleAddToWishlist}>
              Wishlist
            </button>
          </>
        )}

        {isAdmin && (
          <>
            <button className="btn-edit" onClick={handleEdit}>
              Edit
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
