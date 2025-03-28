import React from 'react'
import moment from "moment/moment"
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr"
import { Tooltip } from "react-tooltip"

const TravelStoryCard = ({ 
    imgUrl,
    title,
    date,
    story,
    visitedLocation,
    isFavourite,
    isPublic,
    onFavouriteClick,
    onClick,
}) => {
    console.log("IsPublic:",isPublic);
  return (
    <div className='border border-slate-600/60 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer'>

        {/* Public/Private Indicator */}
        <div className='absolute top-2 left-2'>
            <span 
                className={`w-4 h-4 rounded-full cursor-pointer inline-block ${isPublic ? 'bg-green-500 border-2 border-green-400' : 'bg-red-500 border-2 border-red-700'}`}
                data-tooltip-id="visibility-tooltip"
            />
            <Tooltip id='visibility-tooltip' content={isPublic ? "Public" : "Private"} />
        </div>

        <img src={imgUrl} 
            alt={title}
            loading="lazy"
            className='w-full h-56 object-cover rounded-lg'
            onClick={onClick}
        />

        <button className='w-12 h-12 flex items-center justify-center bg-slate-200/50 rounded-lg border border-white/30 absolute top-4 right-4' onClick={onFavouriteClick}>
            <FaHeart className={`icon-btn ${isFavourite ? "text-red-500" : "text-white"}`}/>
        </button>

        <div className='p-4' onClick={onClick}>
            <div className='flex items-center gap-3'>
                <div className="flex-1">
                    <h6 className='text-sm font-medium'>{title}</h6>
                    <span className='text-xs text-slate-500'>
                        {date ? moment(date).format("Do MMM YYYY"): "-"}
                    </span>
                </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">{ story?.slice(0, 60)}</p>

            <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1'>
                <GrMapLocation className='text-sm'/>
                {visitedLocation.map((item, index) => 
                visitedLocation.length == index+1 ? `${item}` : `${item}, `).join(',  ').replace(/[\[\]"]/g, '')}
            </div>
        </div>
    </div>
  )
}

export default TravelStoryCard


// import React from 'react'
// import moment from "moment/moment"
// import { FaHeart } from "react-icons/fa6";
// import { GrMapLocation } from "react-icons/gr"

// const TravelStoryCard = ({ imgUrl,
//     title,
//     date,
//     story,
//     visitedLocation,
//     isFavourite,
//     onFavouriteClick,
//     onClick,
// }) => {
//   return (
//     <div className='border border-slate-600/60 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer'>
//         <img src={imgUrl} 
//         alt={title}
//         loading="lazy"
//         className='w-full h-56 object-cover rounded-lg'
//         onClick={onClick}
//          />

//          <button className='w-12 h-12 flex items-center justify-center bg-slate-200/50 rounded-lg border border-white/30 absolute top-4 right-4' onClick={onFavouriteClick}>
//             <FaHeart className={`icon-btn ${isFavourite ? "text-red-500" : "text-white"}`}/>
//          </button>

//          <div className='p-4' onClick={onClick}>
//             <div className='flex items-center gap-3'>
//             <div className="flex-1">
//                 <h6 className='text-sm font-medium'>{title}</h6>
//                 <span className='text-xs text-slate-500'>
//                     {date ? moment(date).format("Do MMM YYYY"): "-"}
//                 </span>
//             </div>
//             </div>
//             <p className="text-xs text-slate-600 mt-2">{ story?.slice(0, 60)}</p>

//             <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1'>
//                 <GrMapLocation className='text-sm'/>
//                 {visitedLocation.map((item, index)=>
//                 visitedLocation.length == index+1 ? `${item}` : `${item}, `).join(',  ').replace(/[\[\]"]/g, '')}
//             </div>
//          </div>
//     </div>
//   )
// }

// export default TravelStoryCard