import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div className="">
          <img src={assets.logo} alt="Fantasy Luxe logo" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Discover the epitome of luxury at Fantasy Luxe. We bring you curated collections of premium fashion and accessories.
            Our commitment to excellence and authenticity ensures that every piece meets the highest standards
            of quality and style. Join us in experiencing the perfect blend of contemporary fashion and timeless elegance.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><a href="/" className="hover:text-black transition">Home</a></li>
            <li><a href="/about" className="hover:text-black transition">About us</a></li>
            <li><a href="/collections" className="hover:text-black transition">Collections</a></li>
            <li><a href="/contact" className="hover:text-black transition">Support</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">SUPPORT</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li className="hover:text-black transition cursor-pointer">Chat with us 💬</li>
            <li className="hover:text-black transition cursor-pointer">FAQ</li>
            <li className="hover:text-black transition cursor-pointer">Privacy Policy</li>
            <li className="hover:text-black transition cursor-pointer">Terms</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025© Fantasy Luxe - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
