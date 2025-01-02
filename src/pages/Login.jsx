import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setToken } from '../slices/authSlice';
import {setUser} from '../slices/profileSlice';


const Login = () => {
  const {register,handleSubmit,setValue,reset,formState:{errors}} = useForm();
  const {loading} = useSelector(state=> state.auth);
  const dispatch = useDispatch();
  const [forgotPasswordFlag,setforgotPasswordFlag] = useState(false);

  const apiCallResetPassword = async(data) =>{
      dispatch(setLoading(true))
      const res = await apiConnector("PUT",endpoints.RESETPASSTOKEN_API,data);
      if(res.status == 204) toast.success("Email sent");
      else toast.error("Try again later");
      dispatch(setLoading(false));
      setforgotPasswordFlag(false);
  }

  const apiCallLogin = async(data) =>{
    dispatch(setLoading(true));
    try{
      const res = await apiConnector("POST",endpoints.LOGIN_API,data);
      if(!res?.data.responseCode){
        throw new Error(res.data)
      }
      dispatch(setToken(res?.data?.token));
      dispatch(setUser(res?.data?.user));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.setItem("token",JSON.stringify(res?.data?.token));
      localStorage.setItem("user",JSON.stringify(res?.data?.user));
      toast.success("Welcome");  
    }
    catch(error){
      toast.error(error.response.data.body);
    }
    dispatch(setLoading(false));
}

  function onSubmit(data){
    if(forgotPasswordFlag===true) apiCallResetPassword(data);
    else apiCallLogin(data);
    reset();
  }

  return (
    <form className='gap-8 flex flex-col items-center justify-center h-[calc(100%-100px)]' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-4 max-[380px]:w-[100%]'>
           <div className='w-[360px] text-4xl text-center max-[380px]:w-[100%]'>{forgotPasswordFlag ? <>Reset Password</> : <>Welcome Back!</>}</div>
           <div className='w-[360px]  h-14 flex  max-[380px]:w-[100%]'>
              {errors.email && errors.email.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                ): <div className={`w-[2%] bg-green-400`}></div>}
                <input {...register("email",{required:true})} className="w-[98%] bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none font-sans p-3  tracking-widest" placeholder="Enter email"
                ></input>      
           </div>
           
            {
              forgotPasswordFlag ? 
              <div className='w-[360px]  h-[8px] flex flex-col  max-[380px]:w-[100%]'>
                <button className='italic h-[100%] text-gray-300 tracking-wider text-[16px] hover:text-gray-500 transition-text duration-200 font-sans ml-1 flex gap-1 items-center'
                onClick={()=> setforgotPasswordFlag(false)}  disabled={loading}><FaArrowLeftLong/><button disabled={loading}> Back to login</button></button>
              </div>
              : 
              <div className=''>
                <div className='w-[360px] h-14 flex  max-[380px]:w-[100%]'>
                {errors.password && errors.password.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                ): <div className={`w-[2%] bg-green-400`}></div>}
                    <input className="w-[98%] p-3  bg-gray-50 border border-gray-300 text-gray-900  text-sm focus:outline-none  font-sans tracking-wider" placeholder="Enter password" type='password'
                {...register("password",{required:true})}></input>
                </div>
   
                <button className='italic h-[8px] text-gray-300 tracking-wider text-[16px] hover:text-gray-500 transition-all duration-200 font-sans ml-1'
                onClick={()=> setforgotPasswordFlag(true)} disabled={loading}>forgot password?</button>
              </div>
            }  
         
          <button className='hover:bg-[#333232] transition-all duration-200 font-semibold bg-[#000000] text-[22px] p-2 text-white font-sans tracking-wide ' disabled={loading}>{forgotPasswordFlag ?<>Send</>:<>Log In</>}</button>
      </div>
    </form>
  )
}

export default Login