import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import { setLoading } from '../slices/authSlice';
import toast from 'react-hot-toast';
import Loader from "../components/common/Loader";
import OtpInput from 'react-otp-input';
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const {register,handleSubmit,setValue,reset,formState:{errors}} = useForm();
  const {loading} = useSelector(state=> state.auth);
  const dispatch = useDispatch();
  const [otpFlag,setOtpFlag] = useState(false);
  const [otp, setOtp] = useState('');
  const [signUpData,setSignUpData] = useState(null);
  const navigate = useNavigate();
  
  const apiCallSignupWithOtp = async()=>{
    if(otp===""){
      toast.error("Enter otp");
      return;
    }
    dispatch(setLoading(true));
    try{
      const body = {...signUpData,otp:otp};
      const res = await apiConnector("POST",endpoints.SIGNUP_API,body);
      if(!res?.data.responseCode){
        throw new Error(res.data)
      }
      setOtpFlag(false);
      navigate('/login');
      toast.success(res?.data.body);  
    }
    catch(error){
      toast.error(error.response.data.body);
    }
    dispatch(setLoading(false));
  }

  const apiCallSignUp = async(data) =>{
    dispatch(setLoading(true));
    try{
      const body = {email:data.email};
      console.log(body);
      
      const res = await apiConnector("PUT",endpoints.SENDOTP_API,body);
      console.log(res)
      if(!res?.data.responseCode){
        throw new Error(res.data)
      }
      setOtpFlag(true);
      setSignUpData(data);
      toast.success(res?.data.body);  
    }
    catch(error){
      toast.error(error.response.data.body);
    }
    dispatch(setLoading(false));
}

const apiCallSignUpInside = async() =>{
  dispatch(setLoading(true));
  try{
    const body = {email:signUpData.email};
    console.log(body);
    setOtp('');
    const res = await apiConnector("PUT",endpoints.SENDOTP_API,body);
    console.log(res)
    if(!res?.data.responseCode){
      throw new Error(res.data)
    }
    toast.success(res?.data.body);  
  }
  catch(error){
    toast.error(error.response.data.body);
  }
  dispatch(setLoading(false));
}

  function onSubmit(data){
    apiCallSignUp(data);
    reset();
  }

  return (
    loading ? <div className='w-[100%] h-[60%] flex items-center justify-center'><Loader/></div>:
    otpFlag ? 
    <div className='w-[100%] h-[80%] flex items-center justify-center font-sans'>
      <div className='bg-gray-300 bg-opacity-40 py-10 px-16 flex flex-col gap-4 items-center max-[380px]:px-10 max-[340px]:px-6'>
        <VscWorkspaceTrusted className='text-8xl'/>
        <div className='tracking-wider text-2xl mt-2'>
          Enter OTP Code
        </div>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span style={{ width: "10px" }}></span>}
          renderInput={(props) => <input {...props} />}
          isInputNum={true}
          shouldAutoFocus={true}
          inputStyle={{
            border: "1px solid transparent",
            borderRadius: "8px",
            width: "54px",
            height: "54px",
            fontSize: "20px",
            color: "#000",
            fontWeight: "400",
            caretColor: "blue"
          }}
          focusStyle={{
            border: "1px solid #CFD3DB",
            outline: "none"
          }}
      /> 
      <div className='flex items-center tracking-wider text-[18px] gap-1'><div>Don't get code?</div> <div className='text-blue-800 hover:text-blue-900 transition-all duration-200 cursor-pointer ' onClick={()=> apiCallSignUpInside()}> Resend</div></div>
       <div className='hover:bg-[#333232] transition-all duration-200 font-semibold bg-[#000000] text-[22px] p-2 text-white mt-2 cursor-pointer' disabled={loading}
       onClick={()=> apiCallSignupWithOtp()}>Verify OTP</div>
      </div>
    </div>
      : 
    <form className='gap-8 flex flex-col items-center justify-center h-[calc(100%-100px)]' onSubmit={handleSubmit(onSubmit)}>
      <div className='tracking-wider text-4xl'>
        Create Account
      </div>
      <div className='flex flex-col gap-4 tracking-wider font-sans max-[380px]:w-[100%]'>
        <div className=' w-[360px] h-14 flex max-[380px]:w-[100%]'>
         {errors.fullName && errors.fullName.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                ): <div className={`w-[2%] bg-green-400`}></div>}
          <input className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[100%]" placeholder="Enter your full name"
          {...register("fullName",{required:true})}></input>
        </div>
        
        <div className=' w-[360px] h-14 flex'>
         {errors.email && errors.email.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                ): <div className={`w-[2%] bg-green-400`}></div>}
          <input className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[100%]" placeholder="Enter your email"
          {...register("email",{required:true})}></input>
        </div>
        <div className=' w-[360px] h-14 flex max-[380px]:w-[100%]'>
         {errors.password && errors.password.type === "required" ? (
                    <div className={`w-[2%] bg-red-400`}></div>
                ): <div className={`w-[2%] bg-green-400`}></div>}
          <input className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[100%]" placeholder="Enter a password"
          {...register("password",{required:true})}></input>
        </div>

        <div className=' w-[360px] h-14 flex max-[380px]:w-[100%]'>
          {errors.role && errors.role.type === "required" ? (
                      <div className={`w-[2%] bg-red-400`}></div>
                  ): <div className={`w-[2%] bg-green-400`}></div>}
            <select required className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none  p-3 w-[100%]'
            {...register("role",{required:true})}>
              <option value="SEEKER">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>
          <button className='hover:bg-[#333232] transition-all duration-200 font-semibold bg-[#000000] text-[22px] p-2 text-white' disabled={loading}>Sign Up</button>
      </div>
    </form>
  )
}

export default Signup