import moment from "moment";
import React from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import { Tooltip } from "react-tooltip";

const ViewTravelStory = ({
  storyInfo,
  onClose,
  onEditClick,
  onDeleteClick,
  loading
}) => {
  return (
    <div className="relative">
      {/* Public/Private Indicator */}
      <div className="absolute top-0 left-0 m-2 flex items-center gap-2">
        <span
          className={`w-3 h-3 rounded-full cursor-pointer ${
            storyInfo?.isPublic
              ? "bg-green-500 border-2 border-green-400"
              : "bg-red-500 border-2 border-red-700"
          }`}
          data-tooltip-id="visibility-tooltip"
        />
        <Tooltip
          id="visibility-tooltip"
          content={storyInfo?.isPublic ? "Public" : "Private"}
        />
      </div>

      <div className="flex items-center justify-end">
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            <button className="btn-small" onClick={onEditClick} disabled={loading}>
              <MdUpdate className="text-lg" /> UPDATE STORY
            </button>

           { loading ?
            (
                <div className="flex items-center gap-2">
                <div className="animate-spin border-2 border-red-500 border-t-transparent rounded-full w-3.4 h-3.5 bg-white transition-all duration-300 hover:bg-red-500 hover:border-white"></div>
                <span className="text-red-500 transition-all duration-300 hover:text-white">Processing...</span>
              </div>
              )
           :
            (<button className="btn-small btn-delete" onClick={onDeleteClick}>
            <MdDeleteOutline className="text-lg" /> DELETE
          </button>)}

            <button className="" onClick={onClose}>
              <MdClose
                data-tooltip-id="close-tooltip"
                className="text-xl text-slate-400"
              />
              <Tooltip id="close-tooltip" place="bottom-end" content="Close" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">{storyInfo?.title}</h1>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {storyInfo?.visitedDate &&
                moment(storyInfo.visitedDate).format("Do MMM YYYY")}
            </span>

            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
              <GrMapLocation className="text-sm" />
              {/* {storyInfo?.visitedLocation?.join(', ')} */}
              {storyInfo?.visitedLocation?.join(', ').replace(/[\[\]"]/g, '')}

            </div>
          </div>
        </div>

        <img
          src={storyInfo?.imageUrl}
          alt="Selected"
          className="w-full h-[300px] object-cover rounded-lg"
        />

        <div className="mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {storyInfo?.story}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
