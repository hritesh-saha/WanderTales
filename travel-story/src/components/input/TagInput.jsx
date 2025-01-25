import React from 'react'
import { MdAdd } from 'react-icons/md'

const TagInput = ({ tag, setTag }) => {
  return (
    <div>
        <div className="flex items-center gap-4 mt-3">
            <input 
            type="text"
            value={inputValue}
            className='text-sm bg-transparent border px-3 py-2 rounded outline-none'
            placeholder='Add Location'
             />

             <button className='' onClick={addNewTag}>
                <MdAdd className='text-2xl text-cyan-500 hover:text-white'/>
             </button>
        </div>
    </div>
  )
}

export default TagInput