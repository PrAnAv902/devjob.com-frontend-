import React, { useEffect, useMemo, useState } from 'react'
import { apiConnector } from '../services/apiConnector';
import {endpoints} from '../services/apis';
import Job from '../components/core/Job';
import Searchjob from '../components/core/Searchjob';
import useDebounce from "../components/common/useDebounce"
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/common/Loader';
import {setLoading} from "../slices/authSlice";

const Home = () => {
  const [jobs,setJobs] = useState([]);
  const [searchJobsValue1,setSearchJobsValue1] = useState("");
  const [searchJobsValue2,setSearchJobsValue2] = useState("");
  const debounceValue1 = useDebounce(searchJobsValue1,500);
  const debounceValue2 = useDebounce(searchJobsValue2,500);
  const [searchJobs1,setSearchJobs1] = useState([]);
  const [searchJobs2,setSearchJobs2] = useState([]);
  const {loading} = useSelector(state=>state.auth);
  const dispatch = useDispatch();


  const apiCall = async() =>{
      dispatch(setLoading(true));
       console.log(endpoints.FETCH_JOB_FOR_HOME_API)
      const res = await apiConnector("GET",endpoints.FETCH_JOB_FOR_HOME_API);
      setJobs(res?.data?.jobs);
     
      dispatch(setLoading(false));
  }

useMemo(async() =>{
    if(debounceValue1 ==""){
      setSearchJobs1([]);
      return;
    } 
    const res = await apiConnector("PUT",endpoints.FETCH_SEARCH_JOB_NAME_API,{search: debounceValue1.trim()});
    setSearchJobs1(res?.data?.jobs);   
},[debounceValue1]);

useMemo(async() =>{
  if(debounceValue2 ==""){
    setSearchJobs2([]);
    return;
  } 
  const res = await apiConnector("PUT",endpoints.FETCH_SEARCH_JOB_LOCATION_API,{search: debounceValue2.trim()});
  setSearchJobs2(res?.data?.jobs);   
},[debounceValue2]);


  useEffect(()=>{
     apiCall();
  },[]);



  return (
    <div className='w-[100%] h-[calc(100%-180px)] overflow-x-hidden flex flex-col items-center justify-start mt-20 gap-20'>
            {/* body */}
           
                <div className="flex justify-center items-center w-[70%] py-6 bg-gray-300 bg-opacity-40 tracking-wider font-sans gap-1 max-[1050px]:flex-col max-[550px]:w-[90%]">
                  <div className='relative h-14 w-[47%] text-sm max-[1050px]:w-[90%]'>
                     <input className=" bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none p-3 w-[100%] h-[100%]" placeholder="Search for job, company"
                    onChange={ (event)=> setSearchJobsValue1(event.target.value)} maxLength={25} value={searchJobsValue1} disabled={loading}></input>   
                    <div className='absolute top-[100%] w-[100%] z-50 overflow-y-auto scrollbar h-[240px]'>
                       {
                        searchJobs1.map((job,index)=>(
                          <div key={index}>
                              <Searchjob key={index} job={job}/>
                              {index<searchJobs1.length-1?<hr className="h-[1px] bg-gray-500 border-0"></hr>:<></>}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                   
                  <div className='relative h-14 w-[47%] text-sm max-[1050px]:w-[90%]'>
                     <input className="bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none  p-3 h-[100%] w-[100%]"placeholder="Enter a location" 
                     onChange={ (event)=> setSearchJobsValue2(event.target.value)} maxLength={25} value={searchJobsValue2} disabled={loading}></input>
                     <div className='absolute top-[100%] w-[100%] z-50 overflow-y-auto scrollbar h-[240px]'>
                       {
                        searchJobs2.map((job,index)=>(
                            <div key={index}>
                              <Searchjob  job={job}/>
                              {index<searchJobs2.length-1?<hr className="h-[1px] bg-gray-500 border-0"></hr>:<></>}
                            </div>
                          
                        ))
                      }
                    </div>
                  </div>
                    
                    {/* <button className=' text-4xl ml-1 transition-all hover:rotate-180 text-[#000000] ' disabled={loading}><BiJoystickButton/></button> */}
                </div>   

               {
                loading?<Loader/>: 
                <div className='flex justify-evenly items-center w-[100%] flex-wrap'>
                  {
                   jobs && jobs.length>0 &&  jobs.map((job,index)=>(
                      <Job key={index} job={job}/>
                    ))
                  }
                </div>
               }
               
       
    </div>
  )
}

export default Home