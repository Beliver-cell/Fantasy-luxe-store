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
        <title>Affordable Women Accessories in Nigeria | Bags, Watches & Bottles</title>
        <meta name="description" content="Buy affordable women accessories in Nigeria. Shop women bags, female wrist watches, and water bottles for women. Trusted online store with nationwide delivery." />
        <meta name="keywords" content="women bags in nigeria, ladies wrist watch price in nigeria, buy women bag online nigeria, affordable women accessories nigeria, women handbag price in nigeria, female wrist watch nigeria, water bottle for women nigeria, best women bags online nigeria, ladies accessories online nigeria, where to buy women accessories in nigeria" />
        <link rel="canonical" href="https://fantasyluxe.store" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Affordable Women Accessories in Nigeria | Fantasy Luxe" />
        <meta property="og:description" content="We are an online store selling affordable women accessories in Nigeria, including stylish women bags, female wrist watches, and water bottles for women." />
        <meta property="og:url" content="https://fantasyluxe.store" />

        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            "name": "Fantasy Luxe",
            "description": "We are an online store selling affordable women accessories in Nigeria.",
            "url": "https://fantasyluxe.store",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "NG"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "areaServed": "NG"
            }
          })}
        </script>
      </Helmet>
      <div>
        <div className="text-center py-8 px-4 bg-pink-50 text-gray-800">
          <h1 className="text-2xl font-bold mb-3 md:text-3xl">Affordable Women Accessories in Nigeria</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            We are an online store selling affordable women accessories in Nigeria, including stylish women bags,
            female wrist watches, and water bottles for women. Our goal is to make it easy to buy women bags online in Nigeria
            at fair prices. Whether you’re looking for women handbag prices in Nigeria or ladies wrist watch prices,
            we offer quality products with reliable nationwide delivery.
          </p>
        </div>
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
