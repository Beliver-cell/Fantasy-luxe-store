import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import Latescollection from "../components/Latescollection";
import Bestseller from "../components/Bestseller";
import Policy from "../components/Policy";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Fantasy Luxe | Luxury Bags, Watches & Accessories</title>
        <meta name="description" content="Shop the finest collection of luxury bags, watches, and accessories at Fantasy Luxe. Experience soft luxury and effortless style with our curated premium selections." />
        <meta name="keywords" content="luxury fashion nigeria, designer bags, ladies watches, premium accessories, fantasy luxe home" />
        <link rel="canonical" href="https://fantasyluxe.store" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fantasy Luxe | Premium Luxury Fashion & Accessories" />
        <meta property="og:description" content="Explore a world of soft luxury. From chic bags to elegant watches, discover premium accessories designed for those who love beauty and style." />
        <meta property="og:url" content="https://fantasyluxe.store" />
        <meta property="og:image" content="https://fantasyluxe.store/logo.jpg" />
        <meta property="og:site_name" content="Fantasy Luxe" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fantasy Luxe | Premium Luxury Fashion & Accessories" />
        <meta name="twitter:description" content="Discover premium bags, watches, and lifestyle essentials. Experience soft luxury with Fantasy Luxe." />
        <meta name="twitter:image" content="https://fantasyluxe.store/logo.jpg" />

        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            "name": "Fantasy Luxe",
            "description": "Premium online store for luxury bags, watches, and fashion accessories in Nigeria.",
            "url": "https://fantasyluxe.store",
            "logo": "https://fantasyluxe.store/logo.jpg",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "NG"
            }
          })}
        </script>
      </Helmet>
      <div>
        <Hero />
        <Latescollection />
        <Bestseller />
        <Policy />
        <NewsLetter />
      </div>
    </>
  );
};

export default Home;
