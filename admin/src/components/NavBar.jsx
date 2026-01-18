import React from 'react'
import { assets } from '../assets/assets'

const NavBar = ({ setToken, setVisible }) => {
  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <div className='flex items-center gap-4'>
        {/* Hamburger menu for mobile */}
        <img onClick={() => setVisible(true)} className='w-5 cursor-pointer sm:hidden' src={assets.menu_icon || 'https://cdn-icons-png.flaticon.com/512/3388/3388823.png'} alt="menu" />
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      </div>
      <button onClick={logout} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default NavBar
