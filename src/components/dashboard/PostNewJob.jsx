import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import RichEditor from "../core/RichEditor"
import toast from 'react-hot-toast';
import { apiConnector } from '../../services/apiConnector';
import { recruiterEndpoints } from '../../services/apis';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../slices/profileSlice';
import { setToken } from '../../slices/authSlice';



const PostNewJob = () => {
    const {register,handleSubmit,reset,formState:{errors}} = useForm();
    const navigate = useNavigate();
    const {token,loading} = useSelector(state => state.auth);
    const [companiesData,setCompaniesData] = useState([]);
    const [richText, setRichText] = useState('<div>Add description</div>');
    const dispatch = useDispatch();

    async function fetchCompaniesCall(){
       dispatch(setLoading(true));
       try{
        const res = await apiConnector("GET",recruiterEndpoints.FETCH_COMPANIES_API,null,{'Authorization': `Bearer ${token}`});
         
         if(!res?.data.responseCode){
           throw new Error(res.data)
         }
         setCompaniesData(res?.data?.companies); 
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
       }
       dispatch(setLoading(false));
    }


    async function createJob(newData){
      dispatch(setLoading(true));
      try{
        const res = await apiConnector("POST",recruiterEndpoints.CREATE_JOB_API,newData,{'Authorization': `Bearer ${token}`});    
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


  function onSubmit(data){
    if(data.title==="" || data.roleType==="" || data.workingMode==="" || data.salary==="" || data.city==="" || data.country==="" || data.state==="" || data.company===""){
      toast.error("Provide complete info");
      return;
    }
    let newData = {
          ...data,
          "description":richText,
          "companyImage":companiesData.find(compan => compan.company === data.company).companyImage
    }
    createJob(newData);
    reset();
    setRichText('<div>Add description</div>');
  }

  useEffect(()=>{
     fetchCompaniesCall();
  },[])

  
  return (
    <form className='gap-8 flex flex-col items-center justify-start h-[calc(100%-140px)] mt-10 tracking-wider w-[100%] overflow-x-hidden font-sans' onSubmit={handleSubmit(onSubmit)}>
      <div className='tracking-wider text-4xl max-[450px]:text-[30px]'>
        Post New Job
      </div>
      <div className='flex flex-col gap-4 w-[700px] max-[740px]:w-[95%]'>
      <div className='flex-col w-[100%]'>
        <div className='text-gray-400'>Job Title</div>
        <div className='flex w-[100%]'>
           {errors.title && errors.title.type === "required" ? (
                  <div className={`w-[0.8%] bg-red-400`}></div>
                ):<div className={`w-[0.8%] bg-green-400`}></div>}
           <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[100%]" placeholder="Enter job title"
             {...register("title",{required:true})}></input>
        </div>
       
      </div>
      <div className='flex gap-2'>
          <div className='flex  w-[33%]'>
            {errors.roleType && errors.roleType.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                  ):<div className={`w-[2%] bg-green-400`}></div>}
              <select  className='h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none w-[98%]  p-3 tracking-wider'
              {...register("roleType",{required:true})}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div className='flex  w-[33%]'>
            {errors.workingMode && errors.workingMode.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                  ):<div className={`w-[2%] bg-green-400`}></div>}
            <select  className='h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[98%]'
            {...register("workingMode",{required:true})}>
                <option value="WFO">Work from office</option>
                <option value="HYBRID">Hybrid</option>
                <option value="WFH">Work from home</option>  
            </select>
          </div>
          <div className='flex  w-[33%]'>
            {errors.salary && errors.salary.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                  ):<div className={`w-[2%] bg-green-400`}></div>} 
              <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[98%]" placeholder="Salary"
              {...register("salary",{required:true})}></input>  
          </div> 
      </div>
      <div className='flex flex-col w-[100%]'>
         <div className='text-gray-400'>DESCRIPTION</div>
         <RichEditor richText={richText} setRichText={setRichText}/>
      </div>
      <div className='flex gap-2'>
      <div className='flex-col w-[100%]'>
        <div className='text-gray-400'>LOCATION</div>
        <div className='flex gap-2'>
          <div className='flex  w-[33%]'>
           {errors.city && errors.city.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                  ):<div className={`w-[2%] bg-green-400`}></div>}
          <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[98%] " placeholder="City" {...register("city",{required:true})}></input>
          </div>
          
          <div className='flex  w-[33%]'>
           {errors.state && errors.state.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                  ):<div className={`w-[2%] bg-green-400`}></div>}
          <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[98%] " placeholder="State" {...register("state",{required:true})}></input>
          </div>
          <div className='flex  w-[33%]'>
           {errors.country && errors.country.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                  ):<div className={`w-[2%] bg-green-400`}></div>}
          <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[98%]" placeholder="Country" {...register("country",{required:true})}></input>
          </div>  
        </div>
      </div>
    </div>
   <div className='flex-col w-[100%]'>
        <div className='text-gray-400'>COMPANY</div>
        <div className='flex w-[100%]'>
            {errors?.company && errors?.company.type === "required" ? (
                      <div className={`w-[1%] bg-red-400`}></div>
                    ):<div className={`w-[1%] bg-green-400`}></div>} 
          <select className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[99%]" placeholder="Enter company name" 
          {...register("company",{required:true})}>
          {
            companiesData.map((company,index)=>(
                <option key={index} value={company.company}>
                  {company.company}
                </option>
              
            ))
          }
          </select>
        </div>
       
      </div>
       <button className='hover:bg-[#333232] transition-all duration-200 bg-[#000000] text-2xl font-semibold p-2 text-white tracking-wider' disabled={loading} >Save</button>
      </div>
    </form>
  )
}

export default PostNewJob