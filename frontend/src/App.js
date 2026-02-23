import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// Pages
// import Home from './pages/Home';
// import Properties from './pages/Properties';
// import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<div>Home Page - Coming Soon</div>} />
        <Route path="/properties" element={<div>Properties Page - Coming Soon</div>} />
        <Route path="/dashboard" element={<div>Dashboard Page - Coming Soon</div>} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
