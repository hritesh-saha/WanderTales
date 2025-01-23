import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  const navigate= useNavigate();
  const [userInfo, setUserInfo] = useState(null);
   
  //Get User Info
  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
        // Set user info if exists
        setUserInfo(response.data.user);
      }
    }
    catch(error){
      if(error.response.status === 401){
        //Clear storage if unauthorized
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  useEffect(()=> {
    getUserInfo();

    return () => {};
  },[]);

  return (
    <>
    <Navbar/>
    </>
  )
}

export default Home