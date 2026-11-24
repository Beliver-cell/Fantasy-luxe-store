import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero left-side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base tracking-wide">OUR BESTSELLERS</p>
          </div>

          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          
          <Link 
            to="/collections" 
            className="inline-flex items-center gap-3 mt-1 group cursor-pointer"
            aria-label="Shop our latest luxury arrivals"
          >
            <span className="font-semibold text-sm md:text-base tracking-wider group-hover:text-black transition-colors">
              SHOP NOW
            </span>
            <span className="w-8 md:w-11 h-[1.5px] bg-[#414141] group-hover:w-14 group-hover:bg-black transition-all duration-300"></span>
          </Link>
        </div>
      </div>

      {/* Hero Right-side */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <Link to="/collections" className="block cursor-pointer">
          <img 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 h-[250px] sm:h-[350px] lg:h-[450px]" 
            src={assets.myimg24} 
            alt="Fantasy Luxe Luxury Collection" 
          />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
