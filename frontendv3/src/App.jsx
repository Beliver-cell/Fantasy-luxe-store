import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Chatbot from "./components/Chatbot.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  About,
  Cart,
  Collection,
  Contact,
  Home,
  Login,
  Orders,
  Placeorder,
  Product,
  Verify,
  VerifyEmail,
  ResetPassword,
  Profile
} from "./pages/source.js";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Chatbot />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/place-order" element={<Placeorder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />

        {/* SEO Routes from Sitemap */}
        <Route path="/women-bags" element={<Collection initialCategory="Women" initialSubCategory="Bags" />} />
        <Route path="/women-watches" element={<Collection initialCategory="Women" initialSubCategory="Watches" />} />
        <Route path="/water-bottles" element={<Collection initialCategory="Women" initialSubCategory="Accessories" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
