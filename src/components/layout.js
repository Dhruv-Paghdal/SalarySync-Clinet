import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './navbar';
import ErrorMessage from './errorMessage';
import './css/layout.css';

const Layout = () => {
  return (
    <>
      <div className='mainlayout'>
        <div className='layoutNav'><AppNavbar /> </div>
        <div className='layoutContent'>
        <ErrorMessage />
        <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout