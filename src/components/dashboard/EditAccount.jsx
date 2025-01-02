import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { RxCross2 } from "react-icons/rx";
import { FiDownload } from "react-icons/fi";
import { setLoading } from '../../slices/authSlice';
import { seekerEndpoints } from '../../services/apis';
import { apiConnector } from '../../services/apiConnector';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../slices/profileSlice';
import { setToken } from '../../slices/authSlice';


const EditAccount = () => {
   const {register,handleSubmit,setValue,reset} = useForm();
   const {token,loading} = useSelector(state => state.auth);
  const {user} = useSelector(state=>state.profile);
  const [skills,setSkills] = useState([]);
  const [pictureView,setPictureView] = useState("");
  const [resumeView,setResumeView] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(()=>{
      setValue("fullName",user.fullName);
      setValue("email",user.email);
      setValue("company",user.company);
      setValue("totalExperience",user.totalExperience);
      setValue("city",user.city);
      setValue("state",user.state);
      setValue("country",user.country);
      setPictureView(user.picture);
      setResumeView(user.resume);
      setSkills(user?.skills);
  },[user]);

  async function editUser(formData){
    dispatch(setLoading(true));
    try{
      const res = await apiConnector("POST", seekerEndpoints.UPDATE_PROFILE_API ,formData,{'Authorization': `Bearer ${token}`});    
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
    if(data.fullName.trim()!==user.fullName){
      toast.error("Please reload the page");
      return;
    }
    const formData = new FormData();
    formData.append("resume",data.resume[0]);
    formData.append("picture",data.picture[0]);
    formData.append("fullName",data.fullName.trim());
    formData.append("city",data.city.trim());
    formData.append("state",data.state.trim());
    formData.append("country",data.country.trim());
    formData.append("totalExperience",data.totalExperience.trim());
    formData.append("skills",skills);
    formData.append("company",data.company.trim());
    editUser(formData);
  }

    return (
      <div className='flex w-[100%] h-[calc(100%-100px)] items-center justify-center overflow-y-auto '> 
      <form className='gap-8 flex flex-col  tracking-wider w-[100%] items-center justify-center max-[660px]:mt-20' onSubmit={handleSubmit(onSubmit)}>
    
    <div className='tracking-wider text-4xl max-[450px]:text-[30px]'>
      Set up your Profile
    </div>

    <div className='flex flex-col gap-4 w-[700px] font-sans max-[740px]:w-[95%]'>
    <div className='flex-col w-[100%]'>
      <div className='text-gray-400'>Name</div>
      <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[100%] " placeholder="Enter your full name"
      {...register("fullName")} disabled></input>
    </div>
    <div className='flex flex-col w-[100%] '>
        <div className='  flex gap-2 w-[100%]'>
          <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[33.33%] " placeholder="City"
          {...register("city")}></input>
          <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[33.33%] " placeholder="State"
          {...register("state")}></input>      
          <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[33.34%] " placeholder="Country"
          {...register("country")}></input>      
        </div>
    </div>
    <div className='flex-col w-[100%] '>
        <div className='text-gray-400'>WORK CLASSIFICATION</div>
        <div className='flex gap-2'>
            <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[50%] " placeholder="Current company"
            {...register("company")}></input>
            <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[50%] " placeholder="Experience(in years)"
            {...register("totalExperience")}></input>
        </div> 
    </div>

    <div className='flex-col w-[100%]'>
        <div className='text-gray-400'>SKILLS</div>
        <input className="h-14 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[100%]" placeholder="Press ⌘Enter to save" 
        onKeyDown={(event)=> {
          const val = event.target.value.trim();
          if(val==="") return;
            if(event.key == "Tab"){
               if(!skills.includes(val)){
                setSkills([
                  ...skills,
                  val
                ])
                event.target.value = "";
               }
            }
        }}></input>
        <div className='flex flex-wrap gap-2 mt-2 font-semibold'>
          {
            skills.map((skill,index)=>(
               <div key={index} className='flex gap-1 items-center p-2 bg-gray-300 bg-opacity-40'>{skill}<RxCross2 className='cursor-pointer' onClick={()=>{
                setSkills(skills.filter(skil=>skil!==skill))
               }}/></div>
            ))
          }
        </div>
    </div>
    <div className='flex gap-2 w-[100%] max-[650px]:flex-col'>
        <div className='flex-col w-[50%]  max-[650px]:w-[100%]'>
            <div className='text-gray-400'>PROFILE PHOTO</div>
            <div className='p-3 bg-gray-50 border border-gray-300 flex gap-4 justify-center w-[100%] items-center'> 
                {
                  pictureView === "" ?  
                  <img src="https://res.cloudinary.com/dwtmx7rqo/image/upload/w_225,h_225/v1735485319/syb2p1pap61qvyfnwwvj.png" className='w-[55px]'/>   :
                  <img src={pictureView} className='w-[55px]' />   
                }
                <input className=" text-gray-900 text-sm focus:outline-none cursor-pointer w-[calc(100%-55px)]" type='file'
                {...register("picture")}></input>
            </div>
        </div>

        <div className='flex-col w-[50%] max-[650px]:w-[100%]'>
            <div className='text-gray-400'>RESUME</div>
            <div className='p-3 bg-gray-50 border border-gray-300 flex gap-4 justify-center w-[100%] items-center'> 
                  <a href={resumeView} target='_blank'><FiDownload className='text-[55px] p-3 cursor-pointer'/></a> 
                <input className=" text-gray-900 text-sm focus:outline-none cursor-pointer w-[calc(100%-55px)]" type='file'
                {...register("resume")}></input>
            </div>
        </div>
    </div>
     <div className='flex w-[100%] justify-center'>
       <input type="submit" className='hover:bg-[#333232] transition-all duration-200 bg-[#000000] text-2xl font-semibold p-2 text-white tracking-wider w-[100%] cursor-pointer' disabled={loading} ></input>
      </div>
    </div>

      </form> 
      </div>
    )

}

export default EditAccount