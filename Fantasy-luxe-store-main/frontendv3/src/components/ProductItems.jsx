import React, { useContext } from "react";
import { ShopContext } from "../context/Shopcontext";
import { Link } from "react-router-dom";

const ProductItems = ({ id, image, name, price }) => {
  const { currency} = useContext(ShopContext);
  const imageUrl = Array.isArray(image) ? image[0] : image;
  
  return (
    <div>
      <Link to={`/products/${id}`} className="text-gray-700 cursor-pointer">
        <div className="overflow-hidden">
          <img
            src={imageUrl || '/placeholder.png'}
            alt={name || 'Product'}
            className="hover:scale-110 transition ease-in-out w-full h-auto object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </div>
  );
};

export default ProductItems;
