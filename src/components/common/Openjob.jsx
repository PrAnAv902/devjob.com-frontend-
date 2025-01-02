import React, { useEffect, useState } from 'react'
import {endpoints, seekerEndpoints} from "../../services/apis"
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../slices/authSlice';
import { apiConnector } from '../../services/apiConnector';
import toast from 'react-hot-toast';
import { setUser } from '../../slices/profileSlice';
import { setToken } from '../../slices/authSlice';
import Loader from "./Loader";
import parse from "html-react-parser";
import { timeAgo } from '../../Utils/DateTime';
import { LuCalendarFold } from "react-icons/lu";
import { IoMdPeople } from "react-icons/io";
import { HiCursorClick } from "react-icons/hi";
import { IoSaveOutline } from "react-icons/io5";
import {ACCOUNT_TYPE} from "../../Utils/Constants"

const Openjob = () => {
   const {id} = useParams();
   const {loading,token} = useSelector(state=> state.auth);
   const {user} = useSelector(state=> state.profile);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [job,setJob] = useState(null);
  async function fetchJobData(){
    dispatch(setLoading(true));
    try{
      const res = await apiConnector("PUT",endpoints.FETCH_SPECIFIC_JOB_DETAILS_API,{jobId:id});    
      if(!res?.data.responseCode){
          throw new Error(res.data)
      }
      setJob(res?.data.job);
    }
    catch(error){
        toast.error(error.response.data.body);
        navigate('/');
    }
    dispatch(setLoading(false));
  }


  async function applyCall(){
    if(user===null || token===null){
      toast.error("Login to continue");
      navigate('/login');
      return;
    }
    if(user?.role===ACCOUNT_TYPE.RECRUITER){
        toast.error("Not permitted");
        return;
    }
    if(user?.appliedJobs && user?.appliedJobs.filter(usee=>usee.id===id).length>0){
      toast.error("Already applied");
        return;
    }
    dispatch(setLoading(true));
    try{
      const res = await apiConnector("PUT",seekerEndpoints.APPLY_JOB_API + "/" + `${id}`,null,{'Authorization': `Bearer ${token}`});    
      if(!res?.data.responseCode){
          throw new Error(res.data)
      }
      localStorage.removeItem("user");
      dispatch(setUser(null));
      localStorage.setItem("user",JSON.stringify(res?.data.user));
      dispatch(setUser(res?.data.user));
      toast.success(res?.data.body);
      navigate('/');
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


  async function saveCall(){
    if(user===null || token===null){
      toast.error("Login to continue");
      navigate('/login');
      return;
    }
    if(user?.role===ACCOUNT_TYPE.RECRUITER){
        toast.error("Not permitted");
        return;
    }
    if(user?.savedJobs && user?.savedJobs.filter(usee=>usee.id===id).length>0){
      toast.error("Already saved");
        return;
    }
    dispatch(setLoading(true));
    try{
      const res = await apiConnector("PUT",seekerEndpoints.SAVE_JOB_API + "/" + `${id}`,null,{'Authorization': `Bearer ${token}`});    
      if(!res?.data.responseCode){
          throw new Error(res.data)
      }
      localStorage.removeItem("user");
      dispatch(setUser(null));
      localStorage.setItem("user",JSON.stringify(res?.data.user));
      dispatch(setUser(res?.data.user));
      toast.success(res?.data.body);
      navigate('/');
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
    fetchJobData();
  },[])

  return (
    <div className='gap-8 flex flex-col items-center justify-start h-[calc(100%-140px)] mt-10 tracking-wider w-[100%] overflow-x-hidden font-sans'>
      <div className='tracking-wider text-4xl max-[450px]:text-[30px]'>
        Job Details
      </div>
      {
        (user===null || job===null || loading) ? <div className=' mt-5'><Loader/></div>:
         <div className='relative flex  flex-col w-[600px] mt-5 p-8 bg-gray-200 max-[630px]:w-[95%]'>
            <div className='flex gap-3 w-[100%] justify-between  items-center max-[480px]:justify-center'>  
              <div className='flex flex-col gap-4 max-[480px]:items-center'>
                <div className='flex gap-4 w-[100%] max-[480px]:flex-col  max-[480px]:items-center'> 
                  <img src={job.companyImage} className='w-[100px] h-fit'/>
                  <div className=''>
                    <div className='text-3xl font-semibold flex justify-between w-[100%] max-[480px]:justify-center'>
                      <div className='max-[480px]:text-center'>{job.title}</div>  
                    </div>
                    <div className='text-xl font-semibold text-[#2f524c] max-[480px]:text-center'>{job.company}</div>
                    <div className='tracking-widest  max-[480px]:text-center'>{job.city},{job.country}</div>
                    
                    <div className='flex gap-4 min-[565px]:items-center  tracking-widest my-2 max-[564px]:flex-col max-[480px]:gap-1'>
                      <div className='items-center flex gap-1 max-[480px]:justify-center'><LuCalendarFold className='text-2xl font-semibold'/> <div>Posted {timeAgo(job?.creationDetails)}</div></div>
                      <div className='flex gap-1 items-center max-[480px]:justify-center'><IoMdPeople className='text-2xl font-semibold'/> <div>{job.appliedCount} Applicant{job.appliedCount<=1? "" : "s"}</div></div>
                    </div> 
                    <div className='flex gap-4 items-center  tracking-widest my-3 max-[480px]:justify-center'>                  
                      {
                        user && user?.appliedJobs && user?.appliedJobs.filter(usee=>usee.id===id).length>0 ?
                         <div className='flex gap-1  text-xl p-2 justify-center items-center text-[#ffffff] bg-[#000000] cursor-pointer'><HiCursorClick className='text-xl'/>Applied</div>
                        : <div className='flex gap-1  text-xl p-2 justify-center items-center text-[#ffffff] bg-[#000000] cursor-pointer' onClick={()=> applyCall()}><HiCursorClick className='text-xl'/>Apply</div>
                      }                   
                      {
                          user && user?.savedJobs &&  user?.savedJobs.filter(usee=>usee.id===id).length>0 ?
                             <div className='flex gap-1  text-xl p-2 justify-center items-center bg-[#ffffff] cursor-pointer' onClick={()=> navigate('/dashboard/saved-jobs')}><IoSaveOutline className='text-xl' />Saved</div>
                             :<div className='flex gap-1  text-xl p-2 justify-center items-center bg-[#ffffff] cursor-pointer' onClick={()=> saveCall()}><IoSaveOutline className='text-xl' />Save</div>
                      }
                  </div>
                  </div>
                </div>      
                </div>      
              
                     
            </div>
            <hr className="h-px mt-4  mb-4 bg-gray-300 border-0"></hr>
            <div className='flex flex-col w-[100%] gap-4 mt-2'>
                <div className='tracking-wider text-2xl font-semibold'>
                      Job Description:-
                  </div> 
              <div className='flex gap-3  text-lg tracking-widest flex-wrap '>      
                    <div className=' bg-gray-50 p-2 text-[#2f524c] max-[480px]:w-fit' >₹{(job?.salary/12).toLocaleString('en-IN')}/month</div>
                    <div className='p-2 bg-gray-50 text-[#2f524c] max-[480px]:w-fit'>{job?.roleType}</div>
                    <div className='p-2 bg-gray-50 text-[#2f524c] max-[480px]:w-fit'>{job?.workingMode}</div>
                </div>          
                <div className='text-[19px] tracking-widest '>
                    {parse(`${job.description}`)}
                </div>
              
                
            </div> 
            <div className={` top-[-3%] right-[-3%] absolute w-[35px] h-[35px] ${job.jobStatus==="ACTIVE"?"bg-green-400":"bg-red-400"} rounded-full`}></div> 
      </div>
      }
     
    </div>
  )
}

export default Openjob