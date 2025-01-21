import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./login";
import Home from "./Home";
import Header from "./Header";
import Upload from "./Upload";

function App() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const showHeader = location.pathname !== "/";

  const handleSearch = (query) => {
    setSearchQuery(query); 
  };

  return (
    <div>
      {showHeader && <Header onSearch={handleSearch} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home searchQuery={searchQuery} />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
  );
}

export default App;
