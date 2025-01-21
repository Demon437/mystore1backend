import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function Home({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = products.filter((product) =>
        product.pname.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const addToCart = (product) => {
    const { _id, pname, pprice, pdesc, pimage } = product;

    const cartItem = { _id, pname, pprice, pdesc, pimage };
    const existingCart = JSON.parse(localStorage.getItem("cartData")) || [];
    const isProductInCart = existingCart.some(
      (item) => item._id === cartItem._id
    );

    if (isProductInCart) {
      alert(`${pname} is already in the cart!`);
    } else {
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      alert(`${pname} added to cart successfully!`);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Store</h1>
      <MDBRow className="product-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <MDBCol key={product._id} className="product-col">
              <MDBCard className="product-card">
                <MDBCardImage
                  src={
                    product.pimage
                      ? `http://localhost:4000${product.pimage}`
                      : "https://via.placeholder.com/200"
                  }
                  alt={product.pname || "Product Image"}
                  position="top"
                  className="product-image"
                />
                <MDBCardBody>
                  <MDBCardTitle className="product-name">
                    {product.pname}
                  </MDBCardTitle>
                  <MDBCardTitle className="product-price">
                    ${product.pprice}
                  </MDBCardTitle>
                  <MDBCardText className="product-description">
                    {product.pdesc}
                  </MDBCardText>
                  <MDBBtn
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        )}
      </MDBRow>
    </div>
  );
}
