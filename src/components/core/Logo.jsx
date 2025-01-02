import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();
  const {loading} = useSelector(state=> state.auth);
  return (
    <div className='logo flex items-center' disabled={loading}>
        <button className='text-3xl font-semibold p-1 font-sans tracking-wider max-[450px]:text-2xl max-[380px]:text-xl' disabled={loading}  onClick={()=> navigate("/")}>devjobs</button>
        <button className='bg-[#000000] text-3xl font-semibold text-white p-2 max-[450px]:text-2xl max-[380px]:text-xl max-[380px]:p-1' disabled={loading}  onClick={()=> navigate("/")}>.com</button>
    </div>
  )
}

export default Logo