import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "./components";
import { Home, BrowseLands, RegisterLand } from "./pages";
import "./App.css";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseLands />} />
        <Route path="/register" element={<RegisterLand />} />
      </Routes>
    </Router>
  );
}

export default App;
