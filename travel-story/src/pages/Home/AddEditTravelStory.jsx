import React, { useState } from "react";
import { MdAdd, MdClose, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/input/DateSelector";
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [isPublic, setIsPublic] = useState(storyInfo?.isPublic ?? true); // Default to true
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const addNewTravelStory = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("cachedStories");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("story", story);
      formData.append("visitedLocation", visitedLocation);
      formData.append(
        "visitedDate",
        visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
      );
      formData.append("isPublic", isPublic);
      console.log("isPublic before sending:", isPublic);

      if (storyImg) {
        formData.append("image", storyImg);
      }

      const response = await axiosInstance.post(
        "/api/add-travel-story",
        formData
      );

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully!");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTravelStory = async () => {
    setIsLoading(true);
    const storyId = storyInfo._id;
    try {
      localStorage.removeItem("cachedStories");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("story", story);
      formData.append("visitedLocation", visitedLocation);
      formData.append(
        "visitedDate",
        visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
      );
      formData.append("isPublic", isPublic);
      console.log(isPublic);

      if (typeof storyImg === "object") {
        formData.append("image", storyImg);
      } else if (storyInfo.imageUrl) {
        formData.append("exists", true);
      } else {
        formData.append("image", "");
      }

      const response = await axiosInstance.put(
        "/api/edit-story/" + storyId,
        formData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully!");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.log(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddorUpdateClick = () => {
    if (!title) {
      setError("Please enter the title!");
      return;
    }

    if (!story) {
      setError("Please enter the story!");
      return;
    }

    if (visitedLocation.length <= 0) {
      setError("Please enter the visited location!");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div className="flex flex-row">
          {error && (
            <p className="text-xs text-red-500 pt-3 text-right pr-4">{error}</p>
          )}
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            <button className="btn-small" onClick={handleAddorUpdateClick} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                <div className="animate-spin border-2 border-primary border-t-transparent rounded-full w-4 h-4 bg-white transition-all duration-300 hover:bg-primary hover:border-white"></div>
                <span className="text-primary transition-all duration-300 hover:text-white">Processing...</span>
              </div>
              ) : (
                <>
                  {type === "add" ? (
                    <MdAdd className="text-lg" />
                  ) : (
                    <MdUpdate className="text-lg" />
                  )}
                  {type === "add" ? "ADD STORY" : "UPDATE STORY"}
                </>
              )}
            </button>
            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 pt-4">
        <label className="input-box">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="A Day at the Great Wall"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        <ImageSelector image={storyImg} setImage={setStoryImg} />

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">STORY</label>
          <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-200 p-2 rounded border border-slate-400/50"
            placeholder="Your Story"
            rows={10}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>

        <div className="pt-3">
          <label className="input-label">VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>

        {/* Public/Private radio button */}
        <div className="pt-3">
          <label className="input-label">PRIVACY</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isPublic"
                value={true}
                checked={isPublic === true}
                onChange={() => setIsPublic(true)}
              />
              <span>Public</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isPublic"
                value={false}
                checked={isPublic === false}
                onChange={() => setIsPublic(false)}
              />
              <span>Private</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
