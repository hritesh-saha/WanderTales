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
import { MdOutlineSearchOff } from "react-icons/md";
import { FaRegAddressBook, FaRegCalendarTimes } from "react-icons/fa";
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage } from '../../utils/helper';

const Home = () => {
  const navigate= useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const response = await axiosInstance.get("/auth/get-user");
      console.log(response.data.user);
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
    finally {
      setLoading(false);
    }
  };

  //Get All Travel Stories
  const getAllTravelStories = async () => {
    try{
      //Checked catched stories exist
      const cachedStories=localStorage.getItem("cachedStories");
      if(cachedStories){
        const { stories, timestamp }=JSON.parse(cachedStories);
        const oneHour= 60 * 60 * 1000;

        if(timestamp - Date.now() < oneHour){
          setAllStories(stories);
          console.log("using cached stories");
          return;
        } else {
          localStorage.removeItem("cachedStories");
          console.log("Cache expired. Fetching new data");
        }
      }

      const response = await axiosInstance.get("/api/get-all-stories");
      console.log(response.data);
      if(response.data && response.data.stories){
        setAllStories(response.data.stories);
      }

      // Store fetched data in localStorage
      localStorage.setItem("cachedStories",JSON.stringify({ stories:response.data.stories, timestamp:Date.now(), }));
    }
    catch(error){
      console.log("An unexpected error has occured. Please Try again.",error);
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
      localStorage.removeItem("cachedStories");
      const response = await axiosInstance.put("/api/update-is-favourite/"+storyId,
        {
          isFavourite: !storyData.isFavourite,
        }, {
          headers: {
              'Content-Type': 'application/json', // Override multipart/form-data with application/json for login
          }
      }
      );
      if(response.data && response.data.story){
        toast.success("Story Updated Successfully!");
        
        if(filterType === "search" && searchQuery){
          onSearchStory(searchQuery);
        } else if(filterType === "date"){
          filterStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
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
      localStorage.removeItem("cachedStories");
      const response =await axiosInstance.delete("/api/delete-story/"+storyId);

      if(response.data && !response.data.error){
        toast.error("Story Deleted Successfully!");
        setOpenViewModal((prevState)=> ({ ...prevState, isShown:false}));
        getAllTravelStories();
      }
    }catch(error){
          //Handle unexpected error
          setError("An Unexpected Error has occured. please try again.");
      }
  };

  // Search Story
  const onSearchStory = async(query) => {
    try{
      localStorage.removeItem("cachedStories");
      const response =await axiosInstance.get("/api/search",{
        params: {
          query,
        }
      });

      if(response.data && response.data.stories){
        setFilterType("search");
        setAllStories(response.data.stories)
      }

    }catch(error){
          //Handle unexpected error
          console.log("An Unexpected Error has occured. please try again.");
      }
  }

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }

  //Handle Filter Travel Story by Date Range
  const filterStoriesByDate = async(day) => {
    try{
      localStorage.removeItem("cachedStories");
      const startDate=day.from ? moment(day.from).valueOf() : null;
      const endDate=day.to ? moment(day.to).valueOf() : null;

      if(startDate && endDate){
        const response = await axiosInstance.get("/api/travel-stories/filter",{
          params: { startDate, endDate }
        });
        if(response.data && response.data.stories){
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    }catch(error){
      //Handle unexpected error
      console.log("An Unexpected Error has occured. please try again.");
    }
  }

  //Handle Date Range Select
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  }

  const resetFilter = () => {
    setDateRange({ from:null, to:null});
    setFilterType("");
    getAllTravelStories();
  }

  //Empty Card Icons
  const getEmptyCardImg = (filterType) => {
      switch(filterType) {
          case "search":
              return <MdOutlineSearchOff className='w-24 h-24 ml-4 mt-3'/>
          case "date":
              return <FaRegCalendarTimes className='w-24 h-24 ml-4 mt-3'/>
          default:
              return <FaRegAddressBook className='w-24 h-24 ml-4 mt-4'/>
      }
  }

  useEffect(()=> {
    getAllTravelStories();
    getUserInfo();

    return () => {};
  },[]);

  return (
    <>
    <Navbar 
    userInfo={userInfo}
    loading={loading}
    searchQuery={searchQuery} 
    setSearchQuery={setSearchQuery}
    onSearchNote={onSearchStory}
    handleClearSearch={handleClearSearch}
    />
 
    <div className="container mx-auto py-10">

      <FilterInfoTitle
      filterType={filterType}
      filterDates={dateRange}
      onClear={()=>{
        resetFilter();
      }}
      />


      <div className='flex gap-7'>
        <div className="flex-1">
          {allStories.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 ml-10'>{allStories.map((item)=> {
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
            <EmptyCard imgSrc={getEmptyCardImg(filterType)} message={getEmptyCardMessage(filterType)}/>
          )}
        </div>

        <div className='w-[350px]'>
          <div className="bg-white border border-slate-200 shadow-lg shadow-slate-300/60 rounded-lg mr-5">
            <div className="p-3">
              <DayPicker
              captionLayout="dropdown-buttons"
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pagedNavigation
              />
            </div>
          </div>
        </div>
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