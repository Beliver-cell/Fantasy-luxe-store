import React, { useContext } from "react";
import { ShopContext } from "../context/Shopcontext";
import ProductItem from "./ProductItems";

const EmptyState = ({ 
  icon = "cart",
  title = "Nothing here yet", 
  message = "Start exploring our collection",
  showRecommendations = true,
  recommendationTitle = "You might like these",
  buttonText = "Start Shopping",
  onButtonClick
}) => {
  const { products, navigate } = useContext(ShopContext);
  
  const recommendedProducts = products?.slice(0, 4) || [];

  const icons = {
    cart: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    order: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    profile: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    )
  };

  return (
    <div className="py-10">
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
        {icons[icon] || icons.cart}
        <h3 className="mt-6 text-xl font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-500 text-center max-w-sm">{message}</p>
        <button 
          onClick={onButtonClick || (() => navigate("/collection"))}
          className="mt-6 bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-colors"
        >
          {buttonText}
        </button>
      </div>

      {showRecommendations && recommendedProducts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-medium text-center mb-8">{recommendationTitle}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6">
            {recommendedProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                image={item.images}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
