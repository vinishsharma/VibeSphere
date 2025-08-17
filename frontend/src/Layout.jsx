import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function Layout() {

  return (
    <>
      <div className='w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'>
        <Navbar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout
