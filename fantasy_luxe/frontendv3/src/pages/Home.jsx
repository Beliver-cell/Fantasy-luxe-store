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
        <title>Fantasy Luxe - Premium Fashion & Luxury Shopping | Home</title>
        <meta name="description" content="Welcome to Fantasy Luxe - Your destination for premium fashion, luxury accessories, and exclusive collections. Shop authentic designer products with secure Flutterwave payment." />
        <meta name="keywords" content="luxury fashion, premium shopping, designer clothes, exclusive collection, fashion store, online boutique, Fantasy Luxe" />
        <link rel="canonical" href="https://fantasyluxe.com" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fantasy Luxe - Premium Fashion & Luxury Shopping" />
        <meta property="og:description" content="Shop the finest luxury fashion and accessories at Fantasy Luxe" />
        <meta property="og:url" content="https://fantasyluxe.com" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fantasy Luxe - Premium Fashion" />
        <meta name="twitter:description" content="Shop premium fashion and luxury accessories at Fantasy Luxe" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Fantasy Luxe",
            "description": "Premium fashion and luxury shopping destination",
            "url": "https://fantasyluxe.com",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support"
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
