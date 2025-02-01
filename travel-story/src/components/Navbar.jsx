import React from 'react'
import {useNavigate} from "react-router-dom"
import LOGO from "../assets/logo.svg"
import ProfileInfo from './Cards/ProfileInfo'
import SearchBar from './input/SearchBar'

const Navbar = ({ userInfo, loading, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
    const isToken = localStorage.getItem("token");
   const navigate = useNavigate();

   const onLogout = () =>{
    localStorage.clear();
    navigate("/login");
   }

   const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery);
    }
   }

   const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
   }

  return (
    <div className='bg-white flex flex-row items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
        <div className='flex flex-row'>
        <img src={LOGO} alt="WanderTales"  className='h-10'/>
        <p className='text-primary pt-2'>&nbsp;&nbsp;𝓦𝓪𝓷𝓭𝓮𝓻 𝓣𝓪𝓵𝓮𝓼</p>
        </div>

        { isToken && ( <>
         <SearchBar
         value={searchQuery}
         onChange={(e)=> { setSearchQuery(e.target.value);}}
         handleSearch={handleSearch}
         onClearSearch={onClearSearch}
         />
         <ProfileInfo userInfo={userInfo} loading={loading} onLogout={onLogout}/>
          </>) }
    </div>
  )
}

export default Navbar