import React from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios';
import {PrivateRoutes, cekLogin} from '../components/PrivateRoute';

function Navbar({children}) {
  const api = process.env.REACT_APP_API_ENDPOINT;

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/logout`);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      // alihkan ke halaman login
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
    }
  }

  const cekRole = () => {
    const role = localStorage.getItem('role') === 'admin' ? true : false
    return role
  }
  
  return (
    <div>
       <nav className="bg-white drop-shadow sticky top-0 z-10 w-full">
  <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-between h-16">
      <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-between">
        <NavLink to='/' className="text-black font-bold text-xl">Rent Car</NavLink>
        <div className="hidden sm:block sm:ml-6">
          <div className="flex space-x-4">
          <NavLink to="/" className={(navData) => (navData.isActive ? "border border-black text-black px-3 py-2 rounded-md text-sm font-medium" : 'border border-white text-gray-700 hover:border hover:border-black hover:text-black px-3 py-2 rounded-md text-sm font-medium')}>Home</NavLink>
          
          </div>
        </div>
      </div>
     
      <div className='border border-gray-200 h-9 mx-3'>

      </div>
      {cekLogin() ? (
        <div>
          {cekRole() ? (

        <NavLink to="/dashboard/home" className="border border-white text-white bg-blue-500  px-3 py-2 rounded-md text-sm font-medium">Dashboard</NavLink>
          ) : (
            <NavLink to="/dashboard-kostumer/home" className="border border-white text-white bg-blue-500  px-3 py-2 rounded-md text-sm font-medium">Dashboard</NavLink>
          )}
        </div>
        
      ) : (
        <div className="hidden sm:block">
        <div className="flex items-center gap-3">
        <NavLink to="/login" className="border border-white text-white bg-blue-500  px-3 py-2 rounded-md text-sm font-medium">Login</NavLink>
        <NavLink to="/register" className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Sign Up</NavLink>
        </div>
      </div>
      )
      }
     
      
      <div className="-mr-2 flex sm:hidden">
        <button type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
        
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
         
         
          <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  
  <div className="hidden" id="mobile-menu">
    <div className="px-2">
      <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition ease-in-out delay-400">Link 1</a>
      <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition ease-in-out delay-400">Link 2</a>
      <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition ease-in-out delay-400">Link 3</a>
    </div>
    <div className="pt-4 pb-3 border-t border-gray-700">
      <div className="flex items-center px-5">
        <div className="flex-shrink-0">
         
        </div>
        <div className="ml-3">
          <div className="text-base font-medium leading-none text-white">User Name</div>
          <div className="text-sm font-medium leading-none text-gray-400">user@example.com</div>
        </div>
        <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span className="sr-only">View notifications</span>
        
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
      <div className="mt-3 px-2 space-y-1">
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Account settings</a>
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Support</a>
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Sign out</a>
      </div>
    </div>
  </div>
  </nav>
  
    <h1>{children}</h1>
  
    </div>
  )
}

export default Navbar