import React from 'react'
import {useNavigate} from "react-router-dom"
import LOGO from "../assets/logo.svg"
import ProfileInfo from './Cards/ProfileInfo'

const Navbar = ({ userInfo }) => {
    const isToken = localStorage.getItem("token");
   const navigate = useNavigate();

   const onLogout = () =>{
    localStorage.clear();
    navigate("/login");
   }

  return (
    <div className='bg-white flex flex-row items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
        <div className='flex flex-row'>
        <img src={LOGO} alt="WanderTales"  className='h-10'/>
        <p className='text-primary pt-2'>𝓦𝓪𝓷𝓭𝓮𝓻 𝓣𝓪𝓵𝓮𝓼</p>
        </div>

        { isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout}/> }
    </div>
  )
}

export default Navbar