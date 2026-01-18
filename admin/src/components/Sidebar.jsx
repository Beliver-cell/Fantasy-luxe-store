import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = ({ visible, setVisible }) => {
  return (
    <div className={`w-full md:w-[18%] min-h-screen border-r-2 absolute md:static bg-white z-50 transition-all duration-300 ${visible ? 'w-full fixed top-0 left-0 bottom-0 overflow-hidden' : 'w-0 overflow-hidden md:w-[18%] md:min-h-screen'}`}>

      {/* Mobile close button */}
      {visible && (
        <div className='flex justify-end p-4 md:hidden cursor-pointer' onClick={() => setVisible(false)}>
          <div className='flex items-center gap-2 border px-4 py-2 rounded-full border-gray-300'>
            <p>Back</p>
            <img className='h-4 rotate-180' src={assets.dropdown_icon || 'https://cdn-icons-png.flaticon.com/512/271/271220.png'} alt="back" />
          </div>
        </div>
      )}

      <div className={`flex flex-col gap-4 pt-6 ${visible ? 'pl-6' : 'pl-[20%]'} text-[15px]`} onClick={() => visible && setVisible(false)}>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/dashboard'>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
          </svg>
          <p className={`${visible ? 'block' : 'hidden md:block'} text-gray-800`}>Dashboard</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/add'>
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className={`${visible ? 'block' : 'hidden md:block'} text-gray-800`}>Add Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/list'>
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className={`${visible ? 'block' : 'hidden md:block'}`}>List Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/categories'>
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className={`${visible ? 'block' : 'hidden md:block'}`}>Categories</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/order'>
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className={`${visible ? 'block' : 'hidden md:block'}`}>Order Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/settings'>
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className={`${visible ? 'block' : 'hidden md:block'}`}>Settings</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
