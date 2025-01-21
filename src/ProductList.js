import React from "react";

const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          {product.name}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
