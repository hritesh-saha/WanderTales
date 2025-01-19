import React from 'react'

const Login = () => {
  return (
    <div className='h-screen bg-cyan-400 overflow-hidden relative'>
      <div className='container h-screen flex justify-center items-center px-20 mx-auto'>
        <div className='w-2/4 h-[90vh] flex flex-col justify-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
          <h4 className='text-5xl text-white font-semibold leading-[58px]'>
            Capture Your <br/> Journeys
          </h4>
          <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
            Record your Travel experiences and memories in your personal
            travel journal.
          </p>
        </div>
        <div className='w-2/4  h-[75wh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={()=> {}}>
            <h4 className="text-2xl font-bold mb-7">Login</h4>

            <input type="text" placeholder='Email' className='input-box border border-slate-400 rounded-xl' />

            <button type='submit' className="btn-primary">
              LOGIN
            </button>

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button type='submit'
            className='btn-primary btn-light'
            onClick={()=>{
              navigate("/signup")
            }}>
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login