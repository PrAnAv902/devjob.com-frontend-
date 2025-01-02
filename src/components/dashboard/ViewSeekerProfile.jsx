import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { MdLocationOn } from "react-icons/md";
import { ImOffice } from "react-icons/im";
import { GrDocumentPerformance } from "react-icons/gr";
import { RiMailSendFill } from "react-icons/ri";
import { GrLink } from "react-icons/gr";
import useDebounce from '../common/useDebounce';
import { apiConnector } from '../../services/apiConnector';
import {  recruiterEndpoints } from '../../services/apis';
import SaearchUser from './SaearchUser';
import noresult from "../../assets/Images/noresult.png";


const ViewSeekerProfile = () => {
  const {loading,token} = useSelector(state=> state.auth);
  const {applicantSearch} = useSelector(state=> state.profile);
  const [applicant, setApplicant] = useState(null);
  const [searchJobsValue1,setSearchJobsValue1] = useState("");
  const debounceValue1 = useDebounce(searchJobsValue1,500);
  const [searchJobs1,setSearchJobs1] = useState([]);
  
  useMemo(async() =>{
      if(debounceValue1 ==""){
        setSearchJobs1([]);
        return;
      } 
      const res = await apiConnector("PUT",recruiterEndpoints.SEARCH_CANDIDATE_API,{search: debounceValue1.trim()},{'Authorization': `Bearer ${token}`});
      setSearchJobs1(res?.data?.users);  
      console.log(res?.data?.users); 
  },[debounceValue1]);
  


  useEffect(()=>{
     setApplicant(applicantSearch);
  },[applicantSearch]);

  return (
    <div className='gap-10 flex flex-col items-center justify-start h-[calc(100%-140px)] mt-6 tracking-wider w-[100%] overflow-x-hidden font-sans'>
      <div className='relative w-[100%] flex justify-center'>
        <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none p-3 w-[700px] max-[740px]:w-[95%]" placeholder="Enter a name, company or city"
      onChange={ (event)=> setSearchJobsValue1(event.target.value)} maxLength={25} value={searchJobsValue1} disabled={loading}></input>
          <div className='absolute top-[100%] w-[700px] max-[740px]:w-[95%] z-50 overflow-y-auto scrollbar h-[240px]'>
              {
              searchJobs1.map((job,index)=>(
                <div key={index} className='flex w-[100%]'>
                    <SaearchUser key={index} job={job} setApplicant={setApplicant} setSearchJobs1={setSearchJobs1} setSearchJobsValue1={setSearchJobsValue1}/>
                    {index<searchJobs1.length-1?<hr className="h-[1px] bg-gray-500 border-0"></hr>:<></>}
                </div>
              ))
            }
          </div>
      </div>
      
      {
        applicant!==null ?
        <div className='flex flex-col gap-4 bg-gray-300 bg-opacity-40 p-6 w-[360px] max-[360px]:w-[95%]'>
          <div className='flex justify-center'>
          {
            applicant.picture!=="" ?
            <img src={applicant.picture} className='w-[250px] border-black rounded-full'/>   :
            <img src="https://res.cloudinary.com/dwtmx7rqo/image/upload/w_225,h_225/v1735485319/syb2p1pap61qvyfnwwvj.png" className='w-[250px] border-black'/>   
          }
          </div>
          <div className='flex flex-col gap-1 items-center'>
                  <div className='text-4xl'>{applicant?.fullName}</div>
                  {
                      applicant.city==="" && applicant.country=="" ? 
                      <></> :   
                      <div className='text-[17px] text-gray-400 tracking-widest flex items-center italic '><MdLocationOn/> {applicant?.city},{applicant?.country}</div>
                  }
                  <div className='flex items-center text-lg gap-2 font-semibold tracking-widest mt-1'><RiMailSendFill className='text-xl'/>{applicant?.email}</div>
                  {
                      applicant.resume==="" ? 
                      <></> : 
                      <a className='flex items-center p-2 bg-gray-400 bg-opacity-30 gap-2 tracking-widest mt-2 cursor-pointer' href={applicant.resume} target="_blank"><GrLink className=''/> Resume</a>
                  }
                  <div className='flex gap-2 mt-2'>
                   {
                      applicant.company==="" ? 
                      <></> : 
                    <div className='p-2 bg-gray-400 bg-opacity-30 flex items-center gap-2 tracking-widest'><ImOffice/> <div>{applicant.company}</div></div>
                   }
                    {
                      applicant.totalExperience==="" ? 
                      <></> : 
                      <div className='p-2 bg-gray-400 bg-opacity-30 flex items-center gap-2 tracking-widest'><GrDocumentPerformance/><div>{applicant.totalExperience} Years</div></div>
                    }
                    
                  </div>
                  <hr className="h-[1px] bg-gray-400 bg-opacity-50 border-0 w-[100%] my-2"></hr> 
                  <div className='flex gap-2 flex-wrap justify-center'>
                  {
                      applicant && applicant?.skills.map(skill =>(
                         <div className='p-2 text-[#2f524c] bg-gray-50  gap-2 tracking-widest'>{skill}</div>
                      ))
                    }
   
                  </div>
          </div>

      </div>
      :
      <div className='mt-6'><img src={noresult} className='w-[600px]'/></div>
      }
    </div>
  )
}

export default ViewSeekerProfile