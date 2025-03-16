import React, { useState } from 'react';
import { MdAdd, MdClose, MdUpdate } from 'react-icons/md';
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const AddEditTravelStory = ({ 
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
    const [isPublic, setIsPublic] = useState(storyInfo?.isPublic ?? true);  // Default to true

    const [error, setError] = useState(null);

    const addNewTravelStory = async () => {
        try {
            localStorage.removeItem("cachedStories");
            const formData = new FormData();
            formData.append("title", title);
            formData.append("story", story);
            formData.append("visitedLocation", visitedLocation);
            formData.append("visitedDate", visitedDate ? moment(visitedDate).valueOf() : moment().valueOf());
            formData.append("isPublic", isPublic);
            console.log("isPublic before sending:", isPublic);


            if (storyImg) {
                formData.append('image', storyImg);
            }

            const response = await axiosInstance.post("/api/add-travel-story", formData);

            if (response.data && response.data.story) {
                toast.success("Story Added Successfully!");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        try {
            localStorage.removeItem("cachedStories");
            const formData = new FormData();
            formData.append("title", title);
            formData.append("story", story);
            formData.append("visitedLocation", visitedLocation);
            formData.append("visitedDate", visitedDate ? moment(visitedDate).valueOf() : moment().valueOf());
            formData.append("isPublic", isPublic);
            console.log(isPublic);

            if (typeof storyImg === "object") {
                formData.append("image", storyImg);
            } else if (storyInfo.imageUrl) {
                formData.append("exists", true);
            } else {
                formData.append("image", "");
            }

            const response = await axiosInstance.put("/api/edit-story/" + storyId, formData);

            if (response.data && response.data.story) {
                toast.success("Story Updated Successfully!");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
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

        setError("");

        if (type === "edit") {
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    };

    return (
        <div className='relative'>
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    <button className='btn-small' onClick={handleAddorUpdateClick}>
                        {type === "add" ? <MdAdd className='text-lg'/> : <MdUpdate className='text-lg'/>}
                        {type === "add" ? "ADD STORY" : "UPDATE STORY"}
                    </button>
                    <button className='' onClick={onClose}>
                        <MdClose className='text-xl text-slate-400'/>
                    </button>
                </div>
                {error && <p className='text-xs text-red-500 pt-2 text-right pr-4'>{error}</p>}
            </div>

            <div className="flex-1 flex flex-col gap-2 pt-4">
                <label className='input-box'>TITLE</label>
                <input 
                    type="text"
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='A Day at the Great Wall' 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="my-3">
                    <DateSelector date={visitedDate} setDate={setVisitedDate} />
                </div>

                <ImageSelector image={storyImg} setImage={setStoryImg} />

                <div className='flex flex-col gap-2 mt-4'>
                    <label className="input-label">STORY</label>
                    <textarea 
                        type="text"
                        className='text-sm text-slate-950 outline-none bg-slate-200 p-2 rounded border border-slate-400/50'
                        placeholder='Your Story'
                        rows={10}
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                    />
                </div>

                <div className="pt-3">
                    <label className="input-label">VISITED LOCATIONS</label>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
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


// import React, { useState } from 'react'
// import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
// import DateSelector from '../../components/input/DateSelector';
// import ImageSelector from '../../components/input/ImageSelector';
// import TagInput from '../../components/input/TagInput';
// import moment from 'moment';
// import axiosInstance from '../../utils/axiosInstance';
// import { toast } from 'react-toastify';
// //import uploadImage from '../../utils/uploadImage';
// // Added a css import for DateSelector in main.jsx

// const AddEditTravelStory = ({ 
//     storyInfo,
//     type,
//     onClose,
//     getAllTravelStories,
// }) => {
//     const [title, setTitle] = useState( storyInfo?.title || "");
//     const [storyImg, setStoryImg] = useState( storyInfo?.imageUrl || null);
//     const [story, setStory] = useState( storyInfo?.story || "");
//     const [visitedLocation, setVisitedLocation] = useState( storyInfo?.visitedLocation || []);
//     const [visitedDate, setVisitedDate] = useState( storyInfo?.visitedDate || null);
//     const [isPublic, setIsPublic] = useState(storyInfo?.isPublic || null);

//     const [error, setError] = useState(null);


//     //Add new Travel Story
//     const addNewTravelStory = async () => {
//         try {
//             localStorage.removeItem("cachedStories");
//             const formData = new FormData();
//             formData.append("title", title);
//             formData.append("story", story);
//             formData.append("visitedLocation", visitedLocation);
//             formData.append("visitedDate", visitedDate ? moment(visitedDate).valueOf() : moment().valueOf());
//             formData.append("isPublic", isPublic);
    
//             // If there's a story image, append it as well
//             if (storyImg) {
//                 formData.append('image', storyImg);  // 'image' matches the name expected in multer
//             }
    
//             const response = await axiosInstance.post("/api/add-travel-story", formData);
    
//             if (response.data && response.data.story) {
//                 toast.success("Story Added Successfully!");
//                 // Refresh stories
//                 getAllTravelStories();
//                 // Close modal
//                 onClose();
//             }
//         } catch (error) {
//             setError(error.message);
//         }
//     };
    

//     //Update Travel Story
//     const updateTravelStory = async () => {
//         const storyId = storyInfo._id;
//         try{
//             localStorage.removeItem("cachedStories");
//             const formData = new FormData();
//         formData.append("title", title);
//         formData.append("story", story);
//         formData.append("visitedLocation", visitedLocation);
//         formData.append("visitedDate", visitedDate ? moment(visitedDate).valueOf() : moment().valueOf());
//         formData.append("isPublic", isPublic);

//         // Handle the image
//         if (typeof storyImg === "object") {
//             // If a new image is provided, add it to formData
//             formData.append("image", storyImg);
//         } else if (storyInfo.imageUrl) {
//             // If no new image is provided, send back the previous image
//             formData.append("exists", true); // Assuming `data` contains the base64 string
//         } else {
//             // If no image exists, send an empty string
//             formData.append("image", "");
//         }
            
//             const response = await axiosInstance.put("/api/edit-story/"+storyId, formData);

//             if(response.data && response.data.story){
//                 toast.success("Story Updated Successfully!");
//                 //Refresh stories
//                 getAllTravelStories();
//                 //Close modal
//                 onClose();
//             }
//         }
//         catch(error){
//             if(
//                 error.response &&
//                 error.response.data &&
//                 error.response.data.message
//             ){
//                 setError(error.response.data.message);
//             }else{
//                 //Handle unexpected error
//                 setError("An Unexpected Error has occured. please try again.");
//                 console.log(error);
//             }
//         }
//     }

//     const handleAddorUpdateClick = () => {
//         console.log("Input Data:",{title, storyImg, story, visitedLocation, visitedDate, isPublic});

//         if(!title){
//             setError("Please enter the title!");
//             return;
//         }

//         if(!story){
//             setError("Please enter the story!");
//             return;
//         }

//         setError("");

//         if( type === "edit"){
//             updateTravelStory();
//         } else {
//             addNewTravelStory();
//         }
//     };

//     {/*//Delete story image and Update the story
//     const handleDeleteImg = async() => {
//         //Delete the Image
//         const deleteImgRes= await axiosInstance.delete("/delete-image", {
//             params: {
//                 imageUrl: storyInfo.imageUrl,
//             },
//         });
//         if(deleteImgRes.data){
//             const storyId = storyInfo._id;

//             let postData = {
//                 title,
//                 story,
//                 visitedLocation,
//                 visitedDate: moment().valueOf(),
//                 imageUrl: "",
//             };

//             // Updating Story
//             const response = await axiosInstance.put("/edit-story/"+storyId, postData);
//             setStoryImg(null);
//         }
//     }*/}

//   return (
//     <div className='relative'>
//         <div className="flex items-center justify-between">
//             <h5 className="text-xl font-medium text-slate-700">
//                 {type === "add" ? "Add Story" : "Update Story"}
//             </h5>
//             <div>
//             <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
//                 {type === "add" ? (
//                     <button className='btn-small' onClick={handleAddorUpdateClick}>
//                     <MdAdd className='text-lg'/> ADD STORY
//                 </button> ) : (
//                     <>
//                 <button className='btn-small' onClick={handleAddorUpdateClick}>
//                     <MdUpdate className='text-lg'/>UPDATE STORY
//                     </button>

//                     </>)}

//                 <button className='' onClick={onClose}>
//                     <MdClose className='text-xl text-slate-400'/>
//                 </button>
//             </div>
//             {error && (
//                 <p className='text-xs text-red-500 pt-2 text-right pr-4'>{error}</p>
//             )}
//         </div>
//         </div>

//         <div>
//             <div className="flex-1 flex flex-col gap-2 pt-4">
//                 <label className='input-box'>TITLE</label>
//                 <input type="text"
//                 className='text-2xl text-slate-950 outline-none'
//                 placeholder='A Day at the Great Wall' 
//                 value={title}
//                 onChange={(e)=>setTitle(e.target.value)}
//                 />

//                 <div className="my-3">
//                     <DateSelector date={visitedDate} setDate={setVisitedDate} />
//                 </div>

//                 <ImageSelector
//                 image={storyImg}
//                 setImage={setStoryImg}
//                 //handleDeleteImg={handleDeleteImg}
//                 />

//                 <div className='flex flex-col gap-2 mt-4'>
//                     <label className="input-label">STORY</label>
//                     <textarea 
//                     type="text"
//                     className='text-sm text-slate-950 outline-none bg-slate-200 p-2 rounded border border-slate-400/50'
//                     placeholder='Your Story'
//                     rows={10}
//                     value={story}
//                     onChange={(e)=>setStory(e.target.value)}></textarea>
//                 </div>

//                 <div className="pt-3">
//                     <label className="input-label">VISITED LOCATIONS</label>
//                     <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
//                 </div>
//             </div>
//         </div>

//     </div>
//   )
// }

// export default AddEditTravelStory
