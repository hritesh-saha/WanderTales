import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

const PasswordInput = ({ value, onChange, placeholder }) => {

    const [isShowPassword, SetIsShowPassword] = useState(false);

    const toggleShowPassword = () =>{
        SetIsShowPassword(!isShowPassword);
    };


  return (
    <div className="relative bg-cyan-600/5 rounded mb-3">
  <input
    type={isShowPassword ? "text" : "password"}
    value={value}
    onChange={onChange}
    placeholder={placeholder || "password"}
    className="input-box border border-slate-400 rounded-xl pl-4 pr-10 w-full"
  />
  {isShowPassword ? (
    <FaRegEye
      size={22}
      className="absolute right-4 top-6 transform -translate-y-1/2 text-primary cursor-pointer"
      onClick={toggleShowPassword}
    />
  ) : (
    <FaRegEyeSlash
      size={22}
      className="absolute right-4 top-6 transform -translate-y-1/2 text-primary cursor-pointer"
      onClick={toggleShowPassword}
    />
  )}
</div>

  )
}

export default PasswordInput