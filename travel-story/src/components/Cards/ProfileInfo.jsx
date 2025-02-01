import React from "react";
import { getInitials } from "../../utils/helper";
import { IoLogOutOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

const ProfileInfo = ({ userInfo, loading, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      {loading ? (
        <>
        <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="flex flex-row">
          <p className="h-4 w-24 mt-1 bg-gray-300 animate-pulse"></p>
          <button className="h-6 w-6 bg-gray-300 animate-pulse rounded ml-2"></button>
        </div>
        </>
      ) : (
        userInfo && (
          <>
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
              {getInitials(userInfo?.fullName || "")}
            </div>

            <div className="flex flex-row">
              <p className="text-sm font-medium mt-1">
                {userInfo?.fullName || ""}&nbsp;&nbsp;&nbsp;
              </p>
              <button
                className="text-sm text-slate-700 underline"
                onClick={onLogout}
              >
                <IoLogOutOutline
                  data-tooltip-id="logout-tooltip"
                  className="w-6 h-6"
                />
                <Tooltip
                  id="logout-tooltip"
                  place="bottom-end"
                  content="LogOut"
                />
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default ProfileInfo;
