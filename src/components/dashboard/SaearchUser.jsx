import React from 'react'
import { useNavigate } from 'react-router-dom'

const SaearchUser = ({job,setApplicant,setSearchJobs1,setSearchJobsValue1}) => {
  return (
    <div className='w-[100%] bg-gray-300 flex py-3 px-8 max-[450px]:px-6 max-[410px]:px-4 max-[3650px]:py-2 font-sans relative gap-2 justify-between hover:bg-gray-200 transition-all duration-200 cursor-pointer' 
    onClick={()=> {
        setApplicant(job); 
        setSearchJobs1([]);
        setSearchJobsValue1("");
    }}>
        <div className='flex gap-3 items-center justify-between w-[100%]'>
            <div className='flex items-center gap-4'>
                <div className=''>
                    {
                        job.picture!=="" ?
                        <img src={job.picture} className='w-[40px] h-[100%] rounded-full'/> :
                        <img src="https://res.cloudinary.com/dwtmx7rqo/image/upload/w_225,h_225/v1735485319/syb2p1pap61qvyfnwwvj.png" className='w-[40px] h-[100%]'/>
                    } 
                </div>
                <div className='font-semibold text-xl tracking-wider max-[365px]:text-lg' >{job?.fullName}</div>
            </div>
            <div className='flex flex-col justify-between items-end'>
                <div className='text-[19px] max-[365px]:text-[17px]'>{job.company}</div>
                <div className='flex flex-col'>
                    <div className='text-[14px] tracking-wide text-gray-500 -mt-1 max-[365px]:text-[13px]'>{job.city}, {job.country}</div>
                </div>
            </div>
        </div>
            
  </div>
  )
}

export default SaearchUser