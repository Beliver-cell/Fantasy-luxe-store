import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/Shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!backendUrl || backendUrl === 'undefined') {
        toast.error("Backend URL not configured. Please refresh and try again.");
        return;
      }

      const url = currState === "Sign Up" ? backendUrl + "/api/user/register" : backendUrl + "/api/user/login";
      
      const response = await axios.post(url, {
        name: currState === "Sign Up" ? name : undefined,
        email,
        password,
      }, {
        timeout: 15000
      });

      if (response.data.success) {
        if (currState === "Sign Up") {
          toast.success("Check your email for verification code");
          localStorage.setItem("pendingVerificationId", response.data.userId);
          navigate("/verify-email");
        } else {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
        }
      } else {
        toast.error(response.data.message || "Request failed");
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error("Request timeout. Server is slow. Please try again.");
      } else if (error.response?.status === 405) {
        toast.error("Server error: Check backend configuration.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message.includes('ECONNREFUSED')) {
        toast.error("Cannot connect to backend. Make sure it's running.");
      } else {
        toast.error(error.message || "Request failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  });
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-700" />
      </div>

      {currState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Your Full Name"
          type="text"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Your Email Address"
        type="email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Your Password"
        type="password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {currState === "Login" && (
          <p onClick={() => navigate('/reset-password')} className="cursor-pointer hover:underline">
            Forgot your password
          </p>
        )}
        {!currState === "Login" && (
          <div />
        )}

        {currState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
