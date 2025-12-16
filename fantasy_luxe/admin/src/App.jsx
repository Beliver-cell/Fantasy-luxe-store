import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const currency = '$';

const App = () => {
  // Admin bypass: no login page, admin goes straight to dashboard
  const token = 'admin-bypass';
  const setToken = () => {};

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer/>
      <>
        <NavBar setToken={setToken} />
        <hr />
        <div className="flex w-full">
          <Sidebar />
          <div className="flex-1 mx-8 my-8 text-gray-700 text-base">
            <Routes>
              <Route path="/add" element={<Add token={token}/>} />
              <Route path="/list" element={<List token={token} />} />
              <Route path="/order" element={<Orders token={token} />} />
            </Routes>
          </div>
        </div>
      </>
    </div>
  );
};

export default App;
