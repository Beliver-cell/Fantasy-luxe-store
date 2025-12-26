import React from "react";

const NewsLetter = () => {
    function onsubmitHandler(event) {
        event.preventDefault();
    }
  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off
      </p>
      <p className="text-gray-400 mt-3">
        Subscribe to Fantasy Luxe newsletter for exclusive updates, new arrivals, and special offers.
      </p>
      <form onSubmit={onsubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-3 border pl-3">
        <input
          type="email"
          placeholder="Enter your email for exclusive updates"
          className="w-full sm:flex-1 outline-none"
          required
        />
        <button className="bg-black text-white text-xs px-10 py-4">
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
