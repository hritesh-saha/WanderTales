import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from 'react-icons/md';
import Modal from "react-modal";
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';
import { FaRegAddressBook } from 'react-icons/fa6';

const Home = () => {
  const navigate= useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
   
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
  const handleEdit = (data) =>{
    console.log(data);
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }

  //Handle Travel Story Click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  }

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
        toast.success("Story Updated Successfully!");
        getAllTravelStories();
      }
    }
    catch(error){
      console.log("An unexpected error has occured. Please Try again.");
    }
  }

  // Delete Story
  const deleteTravelStory = async(data) => {
    const storyId= data._id;

    try{
      const response =await axiosInstance.delete("/delete-story/"+storyId);

      if(response.data && !response.data.error){
        toast.error("Story Deleted Successfully!");
        setOpenViewModal((prevState)=> ({ ...prevState, isShown:false}));
        getAllTravelStories();
      }
    }catch(error){
          //Handle unexpected error
          setError("An Unexpected Error has occured. please try again.");
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
            <div className='grid grid-cols-2 gap-8 ml-10'>{allStories.map((item)=> {
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
            <EmptyCard imgSrc={<FaRegAddressBook className='w-24 h-24 ml-4 mt-4'/>} message={`Start your journey by sharing unforgettable moments - click 'Add' Button to cherish and relive your adventures!`}/>
          )}
        </div>

        <div className='w-[320px]'></div>
      </div>
    </div>

    {/* Add and Edit Travel Story Model  */}
    <Modal
    isOpen={openAddEditModal.isShown}
    onRequestClose={() => {}}
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 999,
      },
    }}
    appElement={document.getElementById("root")}
    className="model-box"
    >
      <AddEditTravelStory
      type={openAddEditModal.type}
      storyInfo={openAddEditModal.data}
      onClose={() => {
        setOpenAddEditModal({isShown: false, type: "add", data: null})
      }}
      getAllTravelStories={getAllTravelStories}
      />
    </Modal>

    {/* View Travel Story Model  */}
    <Modal
    isOpen={openViewModal.isShown}
    onRequestClose={() => {}}
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 999,
      },
    }}
    appElement={document.getElementById("root")}
    className="model-box"
    >
      <ViewTravelStory
      storyInfo={openViewModal.data || null}
      onClose={()=>{
        setOpenViewModal((prevState) => ({ ...prevState, isShown:false}));
      }}
      onEditClick={(prevState)=>{
        setOpenViewModal((prevState) => ({ ...prevState, isShown:false}));
        handleEdit(openViewModal.data || null);
      }}
      onDeleteClick={()=>{
        deleteTravelStory(openViewModal.data || null)
      }}
      />
    </Modal>


    <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-12 bottom-12' 
    onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data:null })}
    >
      <MdAdd className="text-[32px] text-white" />
    </button>


    <ToastContainer/>
    </>
  )
}

export default Home