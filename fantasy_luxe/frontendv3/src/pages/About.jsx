import React from "react";
import { Helmet } from "react-helmet-async";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

const About = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Fantasy Luxe",
    "url": "https://fantasyluxe.com/about",
    "description": "Learn about Fantasy Luxe - Your premier destination for luxury fashion and accessories",
    "mainEntity": {
      "@type": "Organization",
      "name": "Fantasy Luxe",
      "description": "Premium luxury fashion and accessories store offering carefully curated collections",
      "url": "https://fantasyluxe.com",
      "foundingDate": "2024",
      "slogan": "Pretty things for pretty souls",
      "knowsAbout": ["Luxury Fashion", "Designer Clothing", "Premium Accessories", "Men's Fashion", "Women's Fashion", "Kids Fashion"]
    }
  };

  return (
    <>
      <Helmet>
        <title>About Fantasy Luxe - Our Story, Mission & Values | Premium Fashion</title>
        <meta name="description" content="Discover Fantasy Luxe's story - Your premier destination for luxury fashion. Learn about our commitment to quality, exceptional customer service, and carefully curated collections of premium fashion and accessories." />
        <meta name="keywords" content="about Fantasy Luxe, luxury fashion store, premium clothing brand, fashion company, quality assurance, customer service, designer fashion, about us" />
        <link rel="canonical" href="https://fantasyluxe.com/about" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Fantasy Luxe - Our Story & Mission" />
        <meta property="og:description" content="Discover Fantasy Luxe's commitment to quality and exceptional customer service in luxury fashion" />
        <meta property="og:url" content="https://fantasyluxe.com/about" />
        <meta property="og:site_name" content="Fantasy Luxe" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Fantasy Luxe - Premium Fashion" />
        <meta name="twitter:description" content="Learn about our commitment to quality and exceptional service in luxury fashion" />
        
        <script type="application/ld+json">
          {JSON.stringify(aboutSchema)}
        </script>
      </Helmet>
      
      <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px] "
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to Fantasy Luxe, your premier destination for luxury fashion and accessories.
            We pride ourselves on offering an exceptional shopping experience with carefully curated collections
            that embody sophistication and elegance. Our commitment to excellence ensures that every piece
            in our store meets the highest standards of quality and style.
          </p>
          <p>
            At Fantasy Luxe, we believe in delivering excellence in every aspect of our service.
            From personalized styling advice to seamless shopping experience, we go above and beyond
            to ensure your satisfaction. Our team of fashion experts is dedicated to helping you
            discover pieces that perfectly match your style and preferences.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Experience the world of luxury fashion through our expertly curated collections.
            Our mission is to bring you the finest selection of designer pieces, exclusive collaborations,
            and trending styles. We strive to make high-end fashion accessible while maintaining
            the exceptional quality that Fantasy Luxe is known for.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"}></Title>
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Quality Assurance:</b>
          <p className="text-gray-500">
            At Fantasy Luxe, we maintain the highest standards of quality control. Each item in our collection undergoes rigorous inspection to ensure it meets our exceptional standards. We partner with renowned designers and manufacturers to bring you the finest luxury goods.
          </p>
        </div>

        <div className="border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Convenience:</b>
          <p className="text-gray-500">
            Shop luxury at your convenience with Fantasy Luxe's seamless online experience. We offer worldwide shipping, easy returns, and secure payment options. Our user-friendly platform ensures you can browse and purchase your favorite items with ease.
          </p>
        </div>

        <div className="border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-500">
            Our dedicated team at Fantasy Luxe is committed to providing personalized assistance and expert guidance. We're here to help you find the perfect pieces and ensure your shopping experience exceeds expectations.
          </p>
        </div>
      </div>

      <NewsLetter/>
    </div>
    </>
  );
};

export default About;
