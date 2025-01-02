import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GoDotFill } from "react-icons/go";

const Job = ({job}) => {
  const navigate = useNavigate();
  return (
    <div className='w-[340px] bg-gray-300 bg-opacity-40 flex flex-col p-6 font-sans m-4 max-[350px]:p-4'>
      <div className='flex justify-between'>
        <img src={job.companyImage}className='w-[40px] h-[100%]'/>
        <div className='tracking-wider bg-green-500 p-2 text-green-100 flex justify-center items-center gap-1'><GoDotFill className='text-base p-0 animate-pulse'/>{job?.jobStatus}</div>
         </div>
      <div className='mt-4 tracking-wide font-semibold'>{job?.company}</div>
      <div className='font-semibold text-2xl tracking-wider max-[350px]:text-xl'>{job?.title}</div>
      <div className='flex gap-2 mt-2 tracking-wide '>
        <div className='p-2 bg-gray-50  max-[350px]:p-1'>{job?.roleType}</div>
        <div className='p-2 bg-gray-50 max-[350px]:p-1'>{job?.workingMode}</div>
      </div>
      <hr className="h-px mt-8  mb-4 bg-gray-300 border-0"></hr>
      <div className='flex justify-between items-end'>
          <div className='flex flex-col'>
            <div className='tracking-wider font-semibold max-[350px]:text-[14px]'>₹{(job?.salary/12).toLocaleString('en-IN')}/month</div>
            <div className='text-[14px] tracking-wide text-gray-500'>{job.city}, {job.country}</div>
            
        </div>
        <div>

          <div className='hover:bg-[#333232] transition-all duration-200 bg-[#000000] tracking-wide p-2 text-white max-[350px]:p-1  cursor-pointer' onClick={()=>{navigate(`/job/${job.id}`)}}>Apply Now</div>
        </div>
      </div>
     
      
    </div>
  )
}

export default Job