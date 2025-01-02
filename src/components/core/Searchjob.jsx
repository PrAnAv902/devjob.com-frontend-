import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const Searchjob = ({job}) => {
  const navigate  = useNavigate();
  const {loading} = useSelector(state=>state.auth);
  return (
    <div className='w-[100%] bg-gray-300 flex py-5 px-7 font-sans relative gap-2 justify-between hover:bg-gray-200 transition-all duration-200 cursor-pointer' onClick={()=> navigate(`/job/${job.id}`)}>
   <div className='flex gap-3 items-center'>
        <div className=''> <img src={job.companyImage}className='w-[40px] h-[100%]'/></div>
        <div className='font-semibold text-xl tracking-wider max-[450px]:text-lg' >{job?.title}</div>
   </div>
     <div className='flex justify-between items-end max-[420px]:hidden'>
        <div className='flex flex-col'>
          <div className='tracking-wider font-semibold'>₹{(job?.salary/12).toLocaleString('en-IN')}/month</div>
          <div className='text-[14px] tracking-wide text-gray-500'>{job.city}, {job.country}</div>
      </div>
    </div>
  </div>
  )
}

export default Searchjob