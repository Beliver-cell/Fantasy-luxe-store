import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { Helmet } from "react-helmet-async";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setproductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  const fetchingData = async () => {
    try {
      // 1. Immediate display from context
      const contextProduct = products.find(item => item._id === productId);
      if (contextProduct) {
        setproductData(contextProduct);
        setImage(contextProduct.images[0]);
      }

      // 2. Fetch fresh data for real-time stock
      const response = await axios.post(backendUrl + '/api/product/single', { productId });
      if (response.data.success) {
        setproductData(response.data.product);
        // Only update image if not set (or if we want to reset it, currently we keep context image or set it if new)
        if (!contextProduct) setImage(response.data.product.images[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchingData();
  }, [productId, products]);

  useEffect(() => {
    if (productData) {
      const availableSizes =
        productData.sizes && productData.sizes.length > 0
          ? productData.sizes
          : ["One Size"];
      setSize(availableSizes[0]);
      const availableColors =
        productData.colors && productData.colors.length > 0
          ? productData.colors
          : [];
      if (availableColors.length > 0) {
        setSelectedColor(availableColors[0]);
      }
    }
  }, [productData]);

  // Algorithmic keyword extraction from product description and attributes
  const getProductKeywords = (product) => {
    if (!product) return '';
    if (product.keywords && Array.isArray(product.keywords) && product.keywords.length > 0) {
      return product.keywords.join(', ');
    }
    if (typeof product.keywords === 'string' && product.keywords.trim()) {
      return product.keywords;
    }

    // Dynamic keyword extraction from description
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
      'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
      'will', 'with', 'this', 'your', 'our', 'all', 'can', 'item', 'product', 'like', 'just'
    ]);
    const cleanDesc = (product.description || '').toLowerCase().replace(/<[^>]*>/g, ' ').replace(/[^\w\s]/g, ' ');
    const rawWords = cleanDesc.split(/\s+/).filter(w => w.length >= 3 && !stopWords.has(w));
    const wordCounts = {};
    rawWords.forEach(w => { wordCounts[w] = (wordCounts[w] || 0) + 1; });
    const topWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]).slice(0, 15);

    // Extract descriptive 2-word phrases
    const phrases = [];
    for (let i = 0; i < rawWords.length - 1; i++) {
      phrases.push(`${rawWords[i]} ${rawWords[i + 1]}`);
    }
    const topPhrases = Array.from(new Set(phrases)).slice(0, 8);

    const baseKeywords = [
      product.name,
      `${product.name} Fantasy Luxe`,
      product.category,
      product.subCategory,
      `${product.category} ${product.subCategory}`.trim(),
      `luxury ${product.category?.toLowerCase() || 'fashion'}`,
      `designer ${product.subCategory?.toLowerCase() || 'accessories'}`,
      'Fantasy Luxe Nigeria',
      'luxury fashion nigeria',
      'authentic designer store',
      ...topPhrases,
      ...topWords
    ].filter(Boolean);

    return Array.from(new Set(baseKeywords)).join(', ');
  };

  const generateProductSchema = () => {
    if (!productData) return null;

    const keywords = getProductKeywords(productData);

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productData.name,
      description: productData.seoDescription || productData.description,
      keywords: keywords,
      image: productData.images,
      sku: productData._id,
      mpn: productData._id,
      brand: {
        "@type": "Brand",
        name: "Fantasy Luxe",
      },
      manufacturer: {
        "@type": "Organization",
        name: "Fantasy Luxe",
      },
      offers: {
        "@type": "Offer",
        url: `https://fantasyluxe.store/products/${productData._id}`,
        priceCurrency: "NGN",
        price: productData.price,
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        availability: productData.stock !== null && productData.stock <= 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "Fantasy Luxe",
          url: "https://fantasyluxe.store",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "NG",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 3,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 3,
              maxValue: 7,
              unitCode: "DAY",
            },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 7,
          returnMethod: "https://schema.org/ReturnByMail",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "122",
        ratingCount: "122",
      },
      category: productData.category,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Category",
          value: productData.category,
        },
        {
          "@type": "PropertyValue",
          name: "Type",
          value: productData.subCategory,
        },
      ],
    };
  };

  const generateBreadcrumbSchema = () => {
    if (!productData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://fantasyluxe.store",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Collections",
          item: "https://fantasyluxe.store/collections",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: productData.category,
          item: `https://fantasyluxe.store/collections?category=${productData.category}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: productData.name,
          item: `https://fantasyluxe.store/products/${productData._id}`,
        },
      ],
    };
  };

  return productData ? (
    <>
      {(() => {
        const availableSizes =
          productData.sizes.length > 0 ? productData.sizes : ["One Size"];
        return (
          <>
            <Helmet>
              {/* Dynamic Product SEO Title */}
              <title>{productData.seoTitle || `${productData.name} | Fantasy Luxe - Luxury ${productData.category || 'Fashion'}`}</title>
              <meta
                name="title"
                content={productData.seoTitle || `${productData.name} | Fantasy Luxe`}
              />
              {/* Dynamic Product SEO Description from product description */}
              <meta
                name="description"
                content={productData.seoDescription || `${productData.description.substring(0, 155)}... Shop authentic luxury at Fantasy Luxe with fast delivery across Nigeria.`}
              />
              {/* Dynamic Product Keywords from description & attributes */}
              <meta
                name="keywords"
                content={getProductKeywords(productData)}
              />
              <link
                rel="canonical"
                href={`https://fantasyluxe.store/products/${productData._id}`}
              />

              {/* Open Graph Product Metadata with Image SEO */}
              <meta property="og:type" content="product" />
              <meta
                property="og:title"
                content={productData.seoTitle || `${productData.name} | Fantasy Luxe`}
              />
              <meta
                property="og:description"
                content={productData.seoDescription || productData.description.substring(0, 200)}
              />
              <meta property="og:image" content={productData.images[0]} />
              <meta property="og:image:secure_url" content={productData.images[0]} />
              <meta property="og:image:alt" content={productData.name} />
              <meta property="og:image:width" content="1000" />
              <meta property="og:image:height" content="1000" />
              <meta
                property="og:url"
                content={`https://fantasyluxe.store/products/${productData._id}`}
              />
              <meta
                property="product:price:amount"
                content={productData.price}
              />
              <meta property="product:price:currency" content="NGN" />

              {/* Twitter Card with Large Image SEO */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta
                name="twitter:title"
                content={productData.seoTitle || `${productData.name} | Fantasy Luxe`}
              />
              <meta
                name="twitter:description"
                content={productData.seoDescription || productData.description.substring(0, 200)}
              />
              <meta name="twitter:image" content={productData.images[0]} />
              <meta name="twitter:image:alt" content={productData.name} />

              <script type="application/ld+json">
                {JSON.stringify(generateProductSchema())}
              </script>
              <script type="application/ld+json">
                {JSON.stringify(generateBreadcrumbSchema())}
              </script>
            </Helmet>

            <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
              <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                  <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                    {productData.images.map((item, index) => (
                      <img
                        onClick={() => setImage(item)}
                        className="w-[24%] sm:w-full sm:wb-3 flex-shrink-0 cursor-pointer mb-3"
                        src={item}
                        key={index}
                        alt={`${productData.name} - View ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="w-full sm:w-[70%]">
                    <img
                      className="w-full h-auto"
                      src={image}
                      alt={productData.name}
                    />
                  </div>
                </div>
                <div className="flex-1 ">
                  <h1 className="font-medium text-2xl mt-2">
                    {productData.name}
                  </h1>

                  <div className="flex items-center gap-1 mt-2">
                    <img
                      className="w-3.5"
                      src={assets.star_icon}
                      alt="rating"
                    />
                    <img
                      className="w-3.5"
                      src={assets.star_icon}
                      alt="rating"
                    />
                    <img
                      className="w-3.5"
                      src={assets.star_icon}
                      alt="rating"
                    />
                    <img
                      className="w-3.5"
                      src={assets.star_icon}
                      alt="rating"
                    />
                    <img
                      className="w-3.5"
                      src={assets.star_icon}
                      alt="rating"
                    />
                  </div>
                  <p className="mt-5 text-3xl font-medium">
                    {currency}
                    {productData.price}
                  </p>
                  {productData.stock !== null && productData.stock <= 0 && (
                    <div className="mt-3 inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </div>
                  )}
                  <p className="mt-5 text-gray-500 w-4/5">
                    {productData.description}
                  </p>

                  <div className="flex flex-col gap-4 my-8">
                    <p>Select Size</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((item, index) => (
                        <button
                          onClick={() => setSize(item)}
                          className={`border py-2 px-4 bg-gray-100 ${
                            item === size ? "border-orange-500" : ""
                          }`}
                          key={index}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {productData.colors && productData.colors.length > 0 && (
                    <div className="flex flex-col gap-4 mb-8">
                      <p>Select Color</p>
                      <div className="flex flex-wrap gap-2">
                        {productData.colors.map((color, index) => (
                          <button
                            onClick={() => setSelectedColor(color)}
                            className={`border py-2 px-4 bg-gray-100 ${
                              color === selectedColor ? "border-orange-500" : ""
                            }`}
                            key={index}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      addToCart(productData._id, size, selectedColor);
                      setIsAdded(true);
                      setTimeout(() => setIsAdded(false), 2000);
                    }}
                    disabled={productData.stock !== null && productData.stock <= 0}
                    className={`px-8 py-3 text-white text-sm ${
                      productData.stock !== null && productData.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black active:bg-gray-700 hover:bg-gray-900"
                    }`}
                  >
                    {productData.stock !== null && productData.stock <= 0
                      ? "OUT OF STOCK"
                      : isAdded
                      ? "ADDED"
                      : "ADD TO CART"}
                  </button>
                  <hr className="mt-8 sm:w-4/5" />

                  <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                    <p>100% Original product.</p>
                    <p>Secure payment with Flutterwave.</p>
                    <p>Terms and conditions applied.</p>
                  </div>
                </div>
              </div>

              <div className="mt-20">
                <div className="flex ">
                  <b className="border-1 border-gray-300 px-5 py-3 text-sm ">
                    Description
                  </b>
                </div>

                <div className="flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-500">
                  <p>
                    Discover the finest craftsmanship at Fantasy Luxe with our
                    premium selection. Each piece in our collection is carefully
                    chosen for its exceptional quality, unique design, and
                    superior craftsmanship. We work directly with renowned
                    designers and artisans to bring you exclusive pieces that
                    exemplify luxury.
                  </p>
                  <p>
                    Experience luxury redefined with Fantasy Luxe's exclusive
                    collection. Our products are made from the finest materials,
                    ensuring both durability and elegance. Every detail is
                    meticulously crafted to provide you with a truly luxurious
                    experience that meets our high standards of excellence.
                  </p>
                </div>
              </div>

              <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory}
              />
            </div>
          </>
        );
      })()}
    </>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
