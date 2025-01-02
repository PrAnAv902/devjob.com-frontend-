import React, { useEffect, useRef, useState } from 'react'
import { RiCloseLargeLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { setApplicantSearch ,setJobApplicants} from '../../slices/profileSlice';
import useOnClickOutside from '../../Utils/useOnClickOutside';
import { GrLink } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { useNavigate } from 'react-router-dom';

const JobApplicants = () => {

    const {jobApplicants} = useSelector(state=> state.profile);
    const dispatch = useDispatch();
    const [jobs,setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
       setJobs(jobApplicants);
    },[jobApplicants])

    const ref = useRef(null);
    useOnClickOutside(ref, () => dispatch(setJobApplicants(null)))

    if(jobApplicants == null) return (<></>);

    else{
     
        return (
        <div className='z-[101] absolute flex flex-col gap-8 top-[0%] right-[0%] h-[100vh] w-[320px] bg-[#000000] text-[#ffffff]  p-3 max-[400px]:w-[100%] overflow-y-auto'
        onClick={(e) => e.stopPropagation()} ref={ref}>
            <RiCloseLargeLine className='text-3xl cursor-pointer' onClick={()=> {dispatch(setJobApplicants(null))}}/>
            <div className='flex flex-col gap-3 items-center'>
                <div className='text-2xl font-sans tracking-wide text-gray-300 '>Job Applicants</div>
                <hr className="h-[1px] bg-gray-400 border-0 w-[65%] "></hr> 
                <div className='flex flex-col gap-2 font-sans w-[100%]'>
                    {
                        jobs && jobs.length>0 && jobs?.map((job,index)=>(
                            <div key={index} className='flex py-2 px-1 bg-gray-400 bg-opacity-40 w-[100%] gap-1 tracking-wider items-center justify-evenly'>
                                {
                                    job.picture!=="" ?
                                <img src={job.picture} className='w-[47px] rounded-full'/>   :
                                <img src="https://res.cloudinary.com/dwtmx7rqo/image/upload/w_225,h_225/v1735485319/syb2p1pap61qvyfnwwvj.png" className='w-[47px]'/>   
                                }
                                
                                     <div className='flex flex-col items-center'>
                                        <div className='text-[20px] font-semibold'>{job.fullName}</div>
                                         <div className='flex w-[100%] items-center gap-2 text-gray-400 -mt-1'>{job.city}/{job.country}</div> 
                                    </div>

                                 <div className='flex items-center gap-2 cursor-pointer' onClick={()=>{ 
                                  dispatch(setApplicantSearch(job)) 
                                  navigate("/dashboard/view-seeker-profile")
                                  }}>  
                                    <ImProfile className='text-2xl font-semibold '/>
                                 </div>
                                
                            </div>   
                        ))
                    }
                </div>
                
            </div>
            
        </div>
    )
}
}

export default JobApplicants