import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance';
import { all } from 'axios';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

const Home = () => {
  const navigate= useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
   
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
  };

  //Get All Travel Stories
  const getAllTravelStories = async () => {
    try{
      const response = await axiosInstance.get("/get-all-stories");
      if(response.data && response.data.stories){
        setAllStories(response.data.stories);
      }
    }
    catch(error){
      console.log("An unexpected error has occured. Please Try again.");
    }
  }

  //Handle Edit Story Click
  const handleEdit = (data) =>{}

  //Handle Travel Story Click
  const hanleViewStory = (data) => {}

  //Handle Update isFavourite
  const updateIsFavourite = async(storyData) => {
    const storyId= storyData._id;

    try{
      const response = await axiosInstance.put("/update-is-favourite/"+storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if(response.data && response.data.story){
        getAllTravelStories();
      }
    }
    catch(error){
      console.log("An unexpected error has occured. Please Try again.");
    }
  }

  useEffect(()=> {
    getAllTravelStories();
    getUserInfo();

    return () => {};
  },[]);

  return (
    <>
    <Navbar userInfo={userInfo}/>
 
    <div className="container mx-auto py-10">
      <div className='flex gap-7'>
        <div className="flex-1">
          {allStories.length > 0 ? (
            <div className='grid grid-cols-2 gap-4 ml-10'>{allStories.map((item)=> {
              return (
                <TravelStoryCard 
                key={item._id}
                imgUrl={item.imageUrl}
                title={item.title}
                story={item.story}
                date={item.visitedDate}
                visitedLocation={item.visitedLocation}
                isFavourite={item.isFavourite}
                onEdit={() => handleEdit(item)}
                onClick={() => handleViewStory(item)}
                onFavouriteClick={() => updateIsFavourite(item)}
                />
              )
            })}</div>
          ):(
            <>Empty Card Here</>
          )}
        </div>

        <div className='w-[320px]'></div>
      </div>
    </div>
    </>
  )
}

export default Home