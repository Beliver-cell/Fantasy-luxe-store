import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../config/api";

const NewsLetter = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function onsubmitHandler(event) {
        event.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/subscriber/subscribe`, { email });
            
            if (response.data.success) {
                toast.success(response.data.message);
                setEmail("");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          className="bg-black text-white text-xs px-10 py-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
