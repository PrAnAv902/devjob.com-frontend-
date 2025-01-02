import React from 'react'
import error from '../assets/Images/error.png'
const NotFound = () => {
  return (
    <div className='gap-8 flex justify-center items-center h-[calc(100%-100px)] tracking-wider w-[100%] overflow-x-hidden'>
       <img src={error} className='w-[500px] h-[500px]  bg-transparent'/>
    </div>
  )
}

export default NotFound