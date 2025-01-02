import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../slices/authSlice';
import { apiConnector } from '../../services/apiConnector';
import { endpoints } from '../../services/apis';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const {register,handleSubmit,setValue,reset,formState:{errors}} = useForm();
    const {loading} = useSelector(state=> state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
  
    const apiCallResetPassword = async(data) =>{
        dispatch(setLoading(true));
        try{
            const res = await apiConnector("PUT",endpoints.RESETPASSWORD_API,{...data,otp:id});
            if(!res?.data.responseCode){
                throw new Error(res.data)
            }
            toast.success("Reset Done");   
        }
        catch(error){
            toast.error(error.response.data.body);
        }
        navigate("/login");
        dispatch(setLoading(false));
    }
  
  
    function onSubmit(data){
      apiCallResetPassword(data);
      reset();
    }
  
    return (
      <form className='gap-8 flex flex-col items-center justify-center h-[calc(100%-100px)]' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4 w-[360px] max-[360px]:w-[100%] '>
             <div className=' text-4xl text-center max-[360px]:w-[100%]'>Reset Password</div>
             <div className='w-[360px] h-14 flex max-[360px]:w-[100%]'>
                {errors.email && errors.email.type === "required" && (
                      <div className='w-[2%] bg-red-400'></div>
                  )}<input {...register("email",{required:true})} className="w-[98%] bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none font-sans p-3  tracking-widest" placeholder="Enter email"></input>      
             </div>
             
             
                <div className='w-[100%] flex flex-col items-center'>
                  <div className='w-[360px] h-14 flex max-[360px]:w-[100%]'>
                    {errors.password && errors.password.type === "required" && (
                      <div className='w-[2%] bg-red-400'></div>
                      )}
                      <input className="w-[98%] p-3 bg-gray-50 border border-gray-300 text-gray-900  text-sm focus:outline-none  font-sans tracking-wider" type="password" placeholder="Enter new password"
                  {...register("password",{required:true})}></input>
                  </div>
                </div>
              
           
            <button className='hover:bg-[#333232] transition-all duration-200 font-semibold bg-[#000000] text-[22px] p-2 text-white font-sans tracking-wide w-full' disabled={loading}>Reset</button>
        </div>
      </form>
    )
}

export default ResetPassword