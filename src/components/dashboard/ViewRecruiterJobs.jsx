import React, { useEffect, useState } from 'react'
import { GrEdit } from "react-icons/gr";
import { FaClipboardList } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import {timeAgo} from '../../Utils/DateTime';
import { setJobApplicants, setUser } from '../../slices/profileSlice';
import { setLoading, setToken } from '../../slices/authSlice';
import { recruiterEndpoints } from '../../services/apis';
import toast from 'react-hot-toast';
import  { apiConnector }from "../../services/apiConnector"
import { useNavigate } from 'react-router-dom';

const ViewRecruiterJobs = () => {
  const navigate = useNavigate();
  const {user} = useSelector(state=>state.profile);
  const {token,loading} = useSelector(state=>state.auth);
  const [jobs,setJobs] = useState([]);
  const dispatch = useDispatch();
  const statusChange = (job,id)=>{
     let temp = [...jobs];
     let tempo = jobs.find(job=>job.id==id);
     if(tempo.jobStatus === "ACTIVE"){
      tempo = {
        ...tempo,
        jobStatus:"CLOSED"
      }
     }
     else{
      tempo = {
        ...tempo,
        jobStatus:"ACTIVE"
      }
     }
     temp.splice(temp.findIndex(i => i.id==id),1,tempo);
     setJobs(temp);
     dispatch(setUser({
      ...user,
      createdJobs:temp
     }));
     localStorage.removeItem("user");
     localStorage.setItem("user",JSON.stringify({
      ...user,
      createdJobs:temp
     }));
     changeJobStatus(job);
  }

  async function fetchApplicantsList(job){
          dispatch(setLoading(true));
          try{
           const res = await apiConnector("PUT", recruiterEndpoints.FETCH_JOB_APPLICANTS_API, {jobId:job} ,{'Authorization': `Bearer ${token}`});         
            if(!res?.data.responseCode){
              throw new Error(res.data)
            }
            dispatch(setJobApplicants(res?.data?.users));
          }
          catch(error){
            if(error.response.data.responseCode == 401){
             localStorage.removeItem("token");
             localStorage.removeItem("user");
             dispatch(setToken(null));
             dispatch(setUser(null));
             toast.error(error.response.data.body);
             navigate('/login');
            }
            else{
              toast.error(error.response.data.body);
            }
          }
          dispatch(setLoading(false));
       }

  async function changeJobStatus(job){
    dispatch(setLoading(true));
    try{
      const res = await apiConnector("PUT", recruiterEndpoints.CHANGE_JOB_STATUS_API, {jobId:job.id,jobStatus: job.jobStatus==="ACTIVE"?"CLOSED":"ACTIVE"} ,{'Authorization': `Bearer ${token}`});         
      if(!res?.data.responseCode){
        throw new Error(res.data)
      }
    }
    catch(error){
      if(error.response.data.responseCode == 401){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(setToken(null));
        dispatch(setUser(null));
        toast.error(error.response.data.body);
        navigate('/login');
      }
      else{
        toast.error(error.response.data.body);
      }
    }
    dispatch(setLoading(false));
  }

  useEffect(()=>{
      setJobs(user.createdJobs);
  },[user])

  return (
    <div className='  gap-8 flex justify-center h-[calc(100%-124px)] tracking-wider w-[100%] overflow-x-hidden mt-6'>
        <div className='tracking-wider text-4xl w-10/12 flex flex-col items-center gap-8'>
           <div className="flex justify-center items-center max-[450px]:text-[30px]">
                Your jobs 
           </div>
           <div className='flex flex-wrap gap-2 w-[100%] justify-center'>
                {
                   jobs.length>0 &&  jobs.map((job,index)=>(
                    <div className='w-[340px] bg-gray-300 bg-opacity-40 flex flex-col p-6 font-sans m-4 gap-2' key={index}>
                           <div className='flex justify-between w-[100%] items-center h-[15%]'>
                                <img src={job.companyImage} className='w-[40px]'/>
                                <div className='flex items-center  gap-1'>
                                    <input 
                                    name={job.id} 
                                    className="relative w-[3.25rem] h-6 bg-red-400 checked:bg-none checked:bg-green-400 border-2 border-transparent rounded-full cursor-pointer 
                                    transition-colors ease-in-out duration-200 ring-1 ring-offset-1  focus:border-gray-700 focus:ring-gray-700 focus:outline-none appearance-none 
                                    before:inline-block before:size-6 before:bg-white checked:before:[#ffffff] before:translate-x-0 checked:before:translate-x-full before:shadow before:absolute
                                    before:-top-[10%]
                                    before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 after:absolute after:end-1.5 
                                    after:top-[calc(50%-0.40625rem)] after:w-[.8125rem] after:h-[.8125rem] after:bg-no-repeat after:bg-[right_center] after:bg-[length:.8125em_.8125em] 
                                    after:transform after:transition-all after:ease-in-out after:duration-200 after:opacity-70 checked:after:start-1.5 checked:after:end-auto" 
                                    type="checkbox" 
                                    id={job.id} 
                                    checked={job.jobStatus === "ACTIVE"} 
                                    onChange={()=>statusChange(job,job.id)} disabled={loading}>
                                  </input>
                                </div>
                            </div>
                          <div className='flex flex-col'>
                                <div className='text-2xl font-semibold'>{job.title}</div>
                                <div className='text-[13px] text-gray-500 -mt-2'>{job.city}/{job.country}</div>
                          </div>

                          <div className='p-1 text-[#2f524c] bg-gray-50 text-[13px] px-2  w-fit'>POSTED {timeAgo(job.creationDetails).toUpperCase()}</div>
                          <hr className="h-[1px] bg-gray-300 border-0 w-[100%] my-2"></hr> 
                          <div className='flex  gap-3 justify-between'>
                             <div className='p-1 px-2 bg-[#000000] text-[#ffffff] items-center flex text-[19px] cursor-pointer gap-1' onClick={()=> navigate(`/dashboard/edit-job/${job.id}`)}>
                               <GrEdit className='text-lg'/>Edit
                             </div>
                             <div className='p-1 px-2 bg-gray-50 text-[#000000] items-center flex text-[19px] cursor-pointer gap-1' onClick={()=> fetchApplicantsList(job.id)}
                              disabled={loading}>
                              <FaClipboardList/>Applicant list
                            </div>
                          </div>
                    </div>    
                    ))
                }
             </div>
        </div>
    </div>
  )
}
// Total jobs page active
// Total seeker responses
// 

export default ViewRecruiterJobs