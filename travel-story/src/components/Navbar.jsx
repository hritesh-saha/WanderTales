import React from 'react'

import LOGO from "../assets/logo.svg"

const Navbar = () => {
  return (
    <div className='bg-white flex flex-row items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
        <div className='flex flex-row'>
        <img src={LOGO} alt="WanderTales"  className='h-10'/>
        <p className='text-primary pt-2'>𝓦𝓪𝓷𝓭𝓮𝓻 𝓣𝓪𝓵𝓮𝓼</p>
        </div>
    </div>
  )
}

export default Navbar