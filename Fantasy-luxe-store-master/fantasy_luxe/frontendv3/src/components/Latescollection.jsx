import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "./Title";
import ProductItems from "./ProductItems";

const Latescollection = () => {
  const { products } = useContext(ShopContext);
  const [LatestProducts, setLatestProduct] = useState([]);

  useEffect(() => {
    setLatestProduct(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={`LATEST`} text2={`COLLECTIONS`} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Experience the latest arrivals at Fantasy Luxe - where elegance meets contemporary style.
          Browse our newest collection featuring this season's most sought-after pieces, 
          hand-picked to keep you at the forefront of luxury fashion.
        </p>
      </div>
      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6">
        {LatestProducts.map((item, index) => (
          <ProductItems
            key={index}
            id={item._id}
            image={item.images}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Latescollection;
