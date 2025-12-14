import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItems from "../components/ProductItems";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProduct, setfilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setsubCategory] = useState([]);
  const [sortType, setsortType] = useState("relevent");
  
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item != e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const togglesubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setsubCategory((prev) => prev.filter((item) => item != e.target.value));
    } else {
      setsubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productCopy = products.slice();

    if(showSearch && search) {
      productCopy = productCopy.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setfilterProduct(productCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProduct.slice();

    switch (sortType) {
      case "low-high":
        setfilterProduct(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setfilterProduct(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory,search,showSearch,products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <>
      <Helmet>
        <title>Shop Fantasy Luxe Collection - Premium Fashion & Luxury Brands</title>
        <meta name="description" content="Browse our exclusive collection of premium fashion, luxury clothing, and designer accessories. Filter by category, price, and find your perfect style at Fantasy Luxe." />
        <meta name="keywords" content="shop collection, luxury fashion, designer clothing, fashion products, premium brands, exclusive items, Fantasy Luxe collection" />
        <link rel="canonical" href="https://fantasyluxe.com/collections" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shop Fantasy Luxe Collection - Premium Fashion" />
        <meta property="og:description" content="Browse our exclusive collection of premium fashion and luxury items" />
        <meta property="og:url" content="https://fantasyluxe.com/collections" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Fantasy Luxe Collections",
            "url": "https://fantasyluxe.com/collections",
            "numberOfItems": filterProduct.length,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": filterProduct.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": product.name,
                "url": `https://fantasyluxe.com/products/${product._id}`
              }))
            }
          })}
        </script>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        {/* Filter options */}
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
              src={assets.dropdown_icon}
              alt="toggle filters"
            />
          </p>
          {/* Category filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  onChange={toggleCategory}
                  className="w-3"
                  type="checkbox"
                  value={"Men"}
                />{" "}
                Men
              </p>
              <p className="flex gap-2">
                <input
                  onChange={toggleCategory}
                  className="w-3"
                  type="checkbox"
                  value={"Women"}
                />{" "}
                Women
              </p>
              <p className="flex gap-2">
                <input
                  onChange={toggleCategory}
                  className="w-3"
                  type="checkbox"
                  value={"Kids"}
                />{" "}
                Kids
              </p>
            </div>
          </div>
          {/* Subcategory filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  onChange={togglesubCategory}
                  className="w-3"
                  type="checkbox"
                  value={"Topwear"}
                />{" "}
                Topwear
              </p>
              <p className="flex gap-2">
                <input
                  onChange={togglesubCategory}
                  className="w-3"
                  type="checkbox"
                  value={"Bottomwear"}
                />{" "}
                Bottomwear
              </p>
              <p className="flex gap-2">
                <input
                  onChange={togglesubCategory}
                  className="w-3"
                  type="checkbox"
                  value={"Winterwear"}
                />{" "}
                Winterwear
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={"ALL"} text2={"COLLECTIONS"} />
            <select
              onChange={(e) => setsortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2"
            >
              <option value="relevent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Map products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProduct.map((item, index) => (
              <ProductItems
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.images[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;
