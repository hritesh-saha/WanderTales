import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20 ml-32'>
        <div className='bg-cyan-200 rounded-full w-32 h-32 border border-cyan-300'>{imgSrc}</div>
        <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>{message}</p>
    </div>
  )
}

export default EmptyCard