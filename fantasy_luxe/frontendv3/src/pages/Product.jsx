import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { Helmet } from "react-helmet-async";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setproductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchingData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setproductData(item);
        setImage(item.images[0]);
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    fetchingData();
  }, [productId, products]);

  const generateProductSchema = () => {
    if (!productData) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": productData.name,
      "description": productData.description,
      "image": productData.images,
      "sku": productData._id,
      "mpn": productData._id,
      "brand": {
        "@type": "Brand",
        "name": "Fantasy Luxe"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Fantasy Luxe"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://fantasyluxe.com/products/${productData._id}`,
        "priceCurrency": "NGN",
        "price": productData.price,
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Fantasy Luxe",
          "url": "https://fantasyluxe.com"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "NG"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 3,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 3,
              "maxValue": 7,
              "unitCode": "DAY"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 7,
          "returnMethod": "https://schema.org/ReturnByMail"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "122",
        "ratingCount": "122"
      },
      "category": productData.category,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Category",
          "value": productData.category
        },
        {
          "@type": "PropertyValue",
          "name": "Type",
          "value": productData.subCategory
        }
      ]
    };
  };

  const generateBreadcrumbSchema = () => {
    if (!productData) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://fantasyluxe.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Collections",
          "item": "https://fantasyluxe.com/collections"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": productData.category,
          "item": `https://fantasyluxe.com/collections?category=${productData.category}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": productData.name,
          "item": `https://fantasyluxe.com/products/${productData._id}`
        }
      ]
    };
  };

  return productData ? (
    <>
      <Helmet>
        <title>{productData.name} | Fantasy Luxe - Premium Fashion</title>
        <meta name="description" content={`${productData.description.substring(0, 155)}... Shop now at Fantasy Luxe for premium quality.`} />
        <meta name="keywords" content={`${productData.name}, ${productData.category}, ${productData.subCategory}, luxury fashion, Fantasy Luxe, buy online, premium quality`} />
        <link rel="canonical" href={`https://fantasyluxe.com/products/${productData._id}`} />
        
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${productData.name} | Fantasy Luxe`} />
        <meta property="og:description" content={productData.description.substring(0, 200)} />
        <meta property="og:image" content={productData.images[0]} />
        <meta property="og:url" content={`https://fantasyluxe.com/products/${productData._id}`} />
        <meta property="product:price:amount" content={productData.price} />
        <meta property="product:price:currency" content="NGN" />
        
        <meta name="twitter:card" content="product" />
        <meta name="twitter:title" content={`${productData.name} | Fantasy Luxe`} />
        <meta name="twitter:description" content={productData.description.substring(0, 200)} />
        <meta name="twitter:image" content={productData.images[0]} />
        
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
              <img className="w-full h-auto" src={image} alt={productData.name} />
            </div>
          </div>
          <div className="flex-1 ">
            <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

            <div className="flex items-center gap-1 mt-2">
              <img className="w-3 5" src={assets.star_icon} alt="rating" />
              <img className="w-3 5" src={assets.star_icon} alt="rating" />
              <img className="w-3 5" src={assets.star_icon} alt="rating" />
              <img className="w-3 5" src={assets.star_icon} alt="rating" />
              <img className="w-3 5" src={assets.star_icon} alt="rating" />
              <p className="pl-2">(122)</p>
            </div>
            <p className="mt-5 text-3xl font-medium">
              {currency}
              {productData.price}
            </p>
            <p className="mt-5 text-gray-500 w-4/5">{productData.description}</p>

            <div className="flex flex-col gap-4 my-8">
              <p>Select Size</p>
              <div className="flex gap-2">
                {productData.sizes.map((item, index) => (
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

            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-black px-8 py-3 text-white text-sm active:bg-gray-700 hover:bg-gray-900"
            >
              ADD TO CART
            </button>
            <hr className="mt-8 sm:w-4/5" />

            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original product.</p>
              <p>Secure payment with Flutterwave.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex ">
            <b className="border-1 border-gray-300 px-5 py-3 text-sm ">
              Description
            </b>
            <p className="border-1 border-gray-300 px-5 py-3 text-sm">
              Reviews (122)
            </p>
          </div>

          <div className="flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-500">
            <p>
              Discover the finest craftsmanship at Fantasy Luxe with our premium selection.
              Each piece in our collection is carefully chosen for its exceptional quality,
              unique design, and superior craftsmanship. We work directly with renowned
              designers and artisans to bring you exclusive pieces that exemplify luxury.
            </p>
            <p>
              Experience luxury redefined with Fantasy Luxe's exclusive collection.
              Our products are made from the finest materials, ensuring both durability
              and elegance. Every detail is meticulously crafted to provide you with
              a truly luxurious experience that meets our high standards of excellence.
            </p>
          </div>
        </div>

        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
