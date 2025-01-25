import React, { useEffect, useRef, useState } from 'react'
import { FaRegFileImage } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({ image, setImage, handleDeleteImg }) => {

    const inputRef= useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) =>{
        const file = event.target.files[0];
        if(file){
            setImage(file);
        }
    }

    const onChooseFile = ()  => {
        inputRef.current.click();
    }

    const handleRemoveImage = ()  => {
        setImage(null);
        handleDeleteImg();
    }

    useEffect(() => {
        if (typeof image === "string") {
          // If the image prop is a URL string, set it as the preview URL
          setPreviewUrl(image);
        } else if (image) {
          // If the image prop is an object, create a URL from it
          const objectUrl = URL.createObjectURL(image);
          setPreviewUrl(objectUrl);
    
          // Clean up the object URL when the component unmounts or image changes
          return () => {
            URL.revokeObjectURL(objectUrl);
          };
        } else {
          // Clear the preview URL if there’s no image
          setPreviewUrl(null);
        }
      }, [image]);

  return (
    <div>
        <input 
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
         />

         {!image ? (<button className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-200 rounded border border-slate-400/50 ' onClick={()=>onChooseFile()}>
            <div className='w-14 h-14 flex items-center justify-center bg-cyan-200 rounded-full border border-cyan-300'>
                <FaRegFileImage className='text-xl text-cyan-500'/>
            </div>
            <p className='text-sm text-slate-500'>Browse image files to upload</p>
         </button>) : (

         <div className="w-full relative">
            <img src={previewUrl} alt="Selected" className='w-full h-[300px] object-cover rounded-lg' />

            <button 
            className='btn-small btn-delete absolute right-2 top-2'
            onClick={handleRemoveImage}
            >
                <MdDeleteOutline className='text-lg'/>
            </button>
         </div>)
          }
    </div>
  )
}

export default ImageSelector