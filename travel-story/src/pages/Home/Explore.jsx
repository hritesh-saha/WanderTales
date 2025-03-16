import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import EmptyCard from "../../components/Cards/EmptyCard";
import ExploreCard from "../../components/Cards/ExploreCard";

const Explore = () => {
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch All Public Travel Stories
  const getAllPublicTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/api/explore-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPublicTravelStories();
  }, []);

  return (
    <div className="p-6">
      {/* Back Button and Title Container */}
      <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center cursor-pointer w-12 h-12 bg-primary hover:bg-cyan-400 text-white rounded-full shadow-md transition"
        >
          <BiArrowBack className="text-3xl" />
        </button>
      <div className="flex items-center justify-between w-full mb-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center flex-1 -ml-12">
          🌍 Discover Hidden Gems
        </h1>
      </div>

      {loading ? (
        <p>Loading stories...</p>
      ) : allStories.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {allStories.map((item) => (
            <ExploreCard
              key={item._id}
              imgUrl={item.imageUrl}
              title={item.title}
              story={item.story}
              date={item.visitedDate}
              visitedLocation={item.visitedLocation}
            />
          ))}
        </div>
      ) : (
        <EmptyCard imgSrc="/assets/placeholder.jpg" message="No public stories available" />
      )}
    </div>
  );
};

export default Explore;
