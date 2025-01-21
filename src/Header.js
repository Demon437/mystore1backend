import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css"; 

export default function Header({ onSearch = () => {} }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleAddProductClick = () => {
    navigate("/upload");
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query); 
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo">My Store</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="add-product-btn" onClick={handleAddProductClick}>
          Add Product
        </button>
      </div>
    </header>
  );
}
