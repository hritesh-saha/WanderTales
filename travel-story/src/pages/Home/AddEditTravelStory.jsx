import React from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const AddEditTravelStory = ({ storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
  return (
    <div>
        <div className="flex items-center justify-between">
            <h5 className="text-xl font-medium text-slate-700">
                {type === "add" ? "Add Story" : "Update Story"}
            </h5>
            <div>
            <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                <button className='btn-small' onClick={()=>{}}>
                    <MdAdd className='text-lg'/> ADD STORY
                </button>

                <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400'/>
                </button>
            </div>
        </div>
        </div>

    </div>
  )
}

export default AddEditTravelStory