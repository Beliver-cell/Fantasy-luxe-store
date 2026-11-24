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

  const activeCategory = category.length === 1 ? category[0] : (category.length > 1 ? category.join(' & ') : '');
  const activeSubCategory = subCategory.length === 1 ? subCategory[0] : '';
  const categoryTitle = activeCategory
    ? `${activeCategory}${activeSubCategory ? ` ${activeSubCategory}` : ''} Collection | Fantasy Luxe - Luxury Fashion`
    : 'Shop Fantasy Luxe Collections - Premium Luxury Fashion';
  const categoryDescription = activeCategory
    ? `Discover our exclusive ${activeCategory}${activeSubCategory ? ` ${activeSubCategory}` : ''} luxury collection at Fantasy Luxe. Shop authentic designer fashion, premium bags, and luxury accessories with fast delivery across Nigeria.`
    : 'Explore the exclusive collections of Fantasy Luxe. Discover high-quality fashion, luxury bags, and elegant watches designed for effortless style.';
  const categoryKeywords = [
    activeCategory,
    activeSubCategory,
    activeCategory && `luxury ${activeCategory.toLowerCase()}`,
    activeCategory && `designer ${activeCategory.toLowerCase()} nigeria`,
    activeSubCategory && `buy ${activeSubCategory.toLowerCase()} online`,
    'Fantasy Luxe store',
    'luxury fashion nigeria',
    'designer accessories nigeria'
  ].filter(Boolean).join(', ');
  const categoryImage = filterProduct.length > 0 && filterProduct[0]?.images?.[0]
    ? filterProduct[0].images[0]
    : 'https://fantasyluxe.store/logo.jpg';
  const canonicalUrl = `https://fantasyluxe.store/collections${category.length === 1 ? `?category=${encodeURIComponent(category[0])}` : ''}`;

  return (
    <>
      <Helmet>
        <title>{categoryTitle}</title>
        <meta name="title" content={categoryTitle} />
        <meta name="description" content={categoryDescription} />
        <meta name="keywords" content={categoryKeywords} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={categoryTitle} />
        <meta property="og:description" content={categoryDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={categoryImage} />
        <meta property="og:image:alt" content={categoryTitle} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={categoryTitle} />
        <meta name="twitter:description" content={categoryDescription} />
        <meta name="twitter:image" content={categoryImage} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": categoryTitle,
            "description": categoryDescription,
            "url": canonicalUrl,
            "numberOfItems": filterProduct.length,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": filterProduct.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": product.name,
                "url": `https://fantasyluxe.store/products/${product._id}`,
                "image": product.images?.[0]
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
                stock={item.stock}
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
