import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
// Added a css import for DateSelector in main.jsx

const AddEditTravelStory = ({ storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
    const [title, setTitle] = useState("");
    const [storyImg, setStoryImg] = useState(null);
    const [story, setStory] = useState("");
    const [visitedLocation, setVisitedLocation] = useState([]);
    const [visitedDate, setVisitedDate] = useState(null);

    const [error, setError] = useState(null);

    //Add new Travel Story
    const addNewTravelStory = async () => {
        try{
            let imageUrl="";
            //Upload image if present
            if(storyImg){
                const imgUploadRes = await uploadImage(storyImg);
                //Get image URL
                imageUrl= imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story",{
                title:title,
                story:story,
                imageUrl:imageUrl || "",
                visitedLocation:visitedLocation,
                visitedDate:visitedDate
                ? moment(visitedDate).valueOf()
                : moment().valueOf(),
            });

            if(response.data && response.data.story){
                toast.success("Story Added Successfully!");
                //Refresh stories
                getAllTravelStories();
                //Close modal
                onClose();
            }
        }
        catch(error){
            setError(error.message);
        }
    }

    //Update Travel Story
    const updateTravelStory = async () => {}

    const handleAddorUpdateClick = () => {
        console.log("Input Data:",{title, storyImg, story, visitedLocation, visitedDate});

        if(!title){
            setError("Please enter the title!");
            return;
        }

        if(!story){
            setError("Please enter the story!");
            return;
        }

        setError("");

        if( type === "edit"){
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    };

    //Delete story image and Update the story
    const handleDeleteImg = async() => {}

  return (
    <div>
        <div className="flex items-center justify-between">
            <h5 className="text-xl font-medium text-slate-700">
                {type === "add" ? "Add Story" : "Update Story"}
            </h5>
            <div>
            <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                {type === "add" ? (
                    <button className='btn-small' onClick={handleAddorUpdateClick}>
                    <MdAdd className='text-lg'/> ADD STORY
                </button> ) : (
                    <>
                <button className='btn-small' onClick={handleAddorUpdateClick}>
                    <MdUpdate className='text-lg'/>UPDATE STORY
                    </button>

                    </>)}

                <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400'/>
                </button>
            </div>
            {error && (
                <p className='text-xs text-red-500 pt-2 text-right pr-4'>{error}</p>
            )}
        </div>
        </div>

        <div>
            <div className="flex-1 flex flex-col gap-2 pt-4">
                <label className='input-box'>TITLE</label>
                <input type="text"
                className='text-2xl text-slate-950 outline-none'
                placeholder='A Day at the Great Wall' 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                />

                <div className="my-3">
                    <DateSelector date={visitedDate} setDate={setVisitedDate} />
                </div>

                <ImageSelector
                image={storyImg}
                setImage={setStoryImg}
                handleDeleteImg={handleDeleteImg}
                />

                <div className='flex flex-col gap-2 mt-4'>
                    <label className="input-label">STORY</label>
                    <textarea 
                    type="text"
                    className='text-sm text-slate-950 outline-none bg-slate-200 p-2 rounded border border-slate-400/50'
                    placeholder='Your Story'
                    rows={10}
                    value={story}
                    onChange={(e)=>setStory(e.target.value)}></textarea>
                </div>

                <div className="pt-3">
                    <label className="input-label">VISITED LOCATIONS</label>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
                </div>
            </div>
        </div>

    </div>
  )
}

export default AddEditTravelStory


//<button className='btn-small btn-delete' onClick={onClose}>
//                        <MdDeleteOutline className='text-lg'/> DELETE
//                    </button>