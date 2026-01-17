import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { backendUrl } from './config/api';
export { backendUrl };
export const currency = '$';

const App = () => {
  const [token, setToken] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-outfit">
      <ToastContainer position="top-center" autoClose={3000} />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <NavBar setToken={setToken} setVisible={setVisible} />
          <hr />
          <div className="flex w-full h-screen">
            <Sidebar visible={visible} setVisible={setVisible} />
            <div className="flex-1 w-full mx-5 my-8 text-gray-700 text-base sm:mx-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/categories" element={<Categories token={token} />} />
                <Route path="/order" element={<Orders token={token} />} />
                <Route path="/settings" element={<Settings token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
