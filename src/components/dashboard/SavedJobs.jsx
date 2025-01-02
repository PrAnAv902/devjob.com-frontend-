import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { timeAgo } from '../../Utils/DateTime';
import { GrOverview } from "react-icons/gr";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import { seekerEndpoints } from '../../services/apis';
import { setUser } from '../../slices/profileSlice';
import { setToken } from '../../slices/authSlice';
import { apiConnector } from '../../services/apiConnector';
import {ACCOUNT_TYPE} from "../../Utils/Constants"
import toast from 'react-hot-toast';
import { setLoading } from '../../slices/authSlice';


const SavedJobs = () => {
  const{loading,token} = useSelector(state=>state.auth);
  const {user} = useSelector(state=>state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function removeCall(id){
    if(user===null || token===null){
      toast.error("Login to continue");
      navigate('/login');
      return;
    }
    if(user?.role===ACCOUNT_TYPE.RECRUITER){
        toast.error("Not permitted");
        return;
    }
    if(user?.savedJobs && user?.savedJobs.filter(usee=>usee.id===id).length===0){
      toast.error("Already not saved");
        return;
    }
    dispatch(setLoading(true));
    try{
      const res = await apiConnector("PUT",seekerEndpoints.UNSAVE_JOB_API + "/" + `${id}`,null,{'Authorization': `Bearer ${token}`});    
      if(!res?.data.responseCode){
          throw new Error(res.data)
      }
      localStorage.removeItem("user");
      dispatch(setUser(null));
      localStorage.setItem("user",JSON.stringify(res?.data.user));
      dispatch(setUser(res?.data.user));
      toast.success(res?.data.body);
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

  return (
    <div className='  gap-8 flex justify-center h-[calc(100%-124px)] tracking-wider w-[100%] overflow-x-hidden mt-6'>
        <div className='tracking-wider text-4xl flex flex-col items-center gap-8'>
            <div className='tracking-wider text-4xl max-[450px]:text-[30px]'>
              Saved Jobs
            </div>
            <div className='flex flex-wrap gap-2 w-[100%] justify-center'>
                            {
                              user && user?.savedJobs && user?.savedJobs.length>0 &&  user?.savedJobs.map((job,index)=>(
                                <div className='w-[340px] bg-gray-300 bg-opacity-40 flex flex-col p-6 font-sans m-4 gap-2 max-[360px]:w-[95%]' key={index}>
                                      <div className='flex justify-between w-[100%] items-center h-[15%]'>
                                            <img src={job.companyImage} className='w-[40px]'/>
                                            <div className='flex items-center  gap-1'>
                                            <div className={`tracking-wider ${job.jobStatus==="ACTIVE"?"bg-green-500":"bg-red-500"} p-2 text-green-100 flex justify-center items-center gap-1 text-base`}><GoDotFill className='text-base p-0 animate-pulse'/>{job?.jobStatus}</div>
                                            </div>
                                        </div>
                                      <div className='flex flex-col'>
                                            <div className='text-2xl font-semibold max-[360px]:text-xl'>{job.title}</div>
                                            <div className='text-[13px] text-gray-500 -mt-2'>{job.city}/{job.country}</div>
                                      </div>
            
                                      <div className='p-1 text-[#2f524c] bg-gray-50 text-[13px] px-2  w-fit max-[360px]:px-1'>POSTED {timeAgo(job.creationDetails).toUpperCase()}</div>
                                      <hr className="h-[1px] bg-gray-300 border-0 w-[100%] my-2"></hr> 
                                      <div className='flex  gap-3 justify-between'>
                                        <div className='p-1 px-2 bg-[#000000] text-[#ffffff] items-center flex text-[19px] cursor-pointer gap-1' onClick={()=>{navigate(`/job/${job.id}`)}} disabled={loading}>
                                         <GrOverview className='text-lg max-[360px]:px-1'/>View
                                        </div>
                                        <div className='p-1 px-2 bg-gray-50 text-[#000000] items-center flex text-[20px] cursor-pointer gap-1 max-[360px]:px-1' 
                                          disabled={loading} onClick={()=> removeCall(job.id)}>
                                          <MdDeleteForever className='text-2xl'/>Remove
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

export default SavedJobs
