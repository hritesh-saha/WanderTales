import { useState} from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import {useNavigate} from "react-router-dom"
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

  const [email, SetEmail] = useState("");
  const [name, SetName] = useState("");
  const [password,SetPassword] = useState("");
  const [error, SetError] = useState(null);

  const navigate= useNavigate();

  const handleSignUp = async(e) =>{
    e.preventDefault();

    if(!name){
      SetError("Please enter your name");
      return;
    }

    if(!validateEmail(email)){
      SetError("Please enter a valid Email Address");
      return;
    }

    if(!password){
      SetError("Please enter a password");
      return;
    }

    SetError("");

    //SignUp API Call
    try{
      const response = await axiosInstance.post("/auth/create-account",{
        fullName: name,
        email: email,
        password: password,
      }, {
        headers: {
            'Content-Type': 'application/json', // Override multipart/form-data with application/json for login
        }
    });

      //Handle successful response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    }
    catch(error){
      if( error.response && error.response.data && error.response.data.message){
        SetError(error.response.data.message);
      } else {
        SetError("An unexpected error has occurred. Pleas try again");
      }
    }
  }

  return (
    <div className='h-screen bg-cyan-300 overflow-hidden relative'>

       <div className='login-ui-box right-10 -top-40' />
       <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2' />

      <div className='container h-screen flex flex-wrap justify-center items-center px-20 mx-auto'>
        <div className='w-2/4 h-[90vh] flex flex-col justify-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
          <h4 className='text-5xl text-white font-semibold leading-[58px]'>
            Join the <br/> Adventures
          </h4>
          <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
            Create an account to start documenting your travels and preserving
            your memories in your personal travel journal.
          </p>
        </div>
        <div className='w-2/4  h-[75wh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-bold mb-7">SignUp</h4>

            <input type="text" placeholder='Full Name' className='input-box border border-slate-400 rounded-xl'
            value={name} onChange={(e)=>{ SetName(e.target.value)}} />

            <input type="text" placeholder='Email' className='input-box border border-slate-400 rounded-xl'
            value={email} onChange={(e)=>{ SetEmail(e.target.value)}} />

            <PasswordInput
            value={password} onChange={(e)=>{ SetPassword(e.target.value)}}
            />
    
           { error && <p className='text-red-500 text-xs pb-1 pl-2'>{error}</p>}

            <button type='submit' className="btn-primary">
            CREATE ACCOUNT
            </button>

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button type='submit'
            className='btn-primary btn-light'
            onClick={()=>{
              navigate("/login")
            }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp