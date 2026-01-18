import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItems from "../components/ProductItems";
import axios from "axios";

const Collection = ({ initialCategory, initialSubCategory }) => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');

  const { products, search, showSearch, backendUrl } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProduct, setfilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setsubCategory] = useState([]);
  const [sortType, setsortType] = useState("relevent");
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (initialCategory) {
      setCategory([initialCategory]);
    } else if (categoryParam) {
      setCategory([categoryParam]);
    }

    if (initialSubCategory) {
      setsubCategory([initialSubCategory]);
    } else if (subCategoryParam) {
      setsubCategory([subCategoryParam]);
    }
  }, [initialCategory, initialSubCategory, categoryParam, subCategoryParam]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/list');
        if (response.data.success && response.data.categories.length > 0) {
          const main = response.data.categories.filter(c => c.type === 'main').map(c => c.name);
          const sub = response.data.categories.filter(c => c.type === 'sub').map(c => c.name);
          setMainCategories(main);
          setSubCategories(sub);
        } else {
          setMainCategories([]);
          setSubCategories([]);
        }
      } catch (error) {
        setMainCategories([]);
        setSubCategories([]);
      }
    };
    fetchCategories();
  }, [backendUrl]);

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

    if (showSearch && search) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
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
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <>
      <Helmet>
        <title>Shop Fantasy Luxe Collection - Premium Fashion & Luxury Brands</title>
        <meta name="description" content="Browse our exclusive collection of premium fashion, luxury clothing, and designer accessories. Filter by category, price, and find your perfect style at Fantasy Luxe." />
        <meta name="keywords" content="shop collection, luxury fashion, designer clothing, fashion products, premium brands, exclusive items, Fantasy Luxe collection" />
        <link rel="canonical" href="https://fantasyluxe.store/collections" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shop Fantasy Luxe Collection - Premium Fashion" />
        <meta property="og:description" content="Browse our exclusive collection of premium fashion and luxury items" />
        <meta property="og:url" content="https://fantasyluxe.store/collections" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Fantasy Luxe Collections",
            "url": "https://fantasyluxe.store/collections",
            "numberOfItems": filterProduct.length,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": filterProduct.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": product.name,
                "url": `https://fantasyluxe.store/products/${product._id}`
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
          {mainCategories.length > 0 && (
            <div
              className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
                } sm:block`}
            >
              <p className="mb-3 text-sm font-medium">CATEGORIES</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {mainCategories.map((cat) => (
                  <p className="flex gap-2" key={cat}>
                    <input
                      onChange={toggleCategory}
                      className="w-3"
                      type="checkbox"
                      value={cat}
                    />{" "}
                    {cat}
                  </p>
                ))}
              </div>
            </div>
          )}
          {/* Subcategory filter */}
          {subCategories.length > 0 && (
            <div
              className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"
                } sm:block`}
            >
              <p className="mb-3 text-sm font-medium">TYPE</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {subCategories.map((sub) => (
                  <p className="flex gap-2" key={sub}>
                    <input
                      onChange={togglesubCategory}
                      className="w-3"
                      type="checkbox"
                      value={sub}
                    />{" "}
                    {sub}
                  </p>
                ))}
              </div>
            </div>
          )}
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
