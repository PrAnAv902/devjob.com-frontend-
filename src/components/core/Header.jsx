import React, { useRef, useState } from 'react'
import Logo from './Logo'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../slices/authSlice';
import { setUser } from '../../slices/profileSlice';
import toast from 'react-hot-toast';
import { RiMenu3Line } from "react-icons/ri";
import { ACCOUNT_TYPE } from '../../Utils/Constants';
import { MdCreateNewFolder } from "react-icons/md";
import { HiMiniNumberedList } from "react-icons/hi2";
import { MdContentPasteSearch } from "react-icons/md";
import useOnClickOutside from '../../Utils/useOnClickOutside';
import { MdSave } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LuFilter } from "react-icons/lu";
import { BiLogIn } from "react-icons/bi";
import { SiGnuprivacyguard } from "react-icons/si";
import { LuLogOut } from "react-icons/lu";

const Header = () => {
  const navigate = useNavigate();
  const {loading,token} = useSelector(state=> state.auth);
  const {user} = useSelector(state=> state.profile);
  const dispatch = useDispatch();
  const [menuActive,setMenuActive] = useState(false);
  
 function signout(){
     localStorage.clear();
     dispatch(setToken(null));
     dispatch(setUser(null));
     toast.success("Logged out");
     navigate('/');
  }

  const ref = useRef(null)

  useOnClickOutside(ref, () => setMenuActive(false))

  return (
    <div className={`header flex justify-center w-[100%] p-6 h-[100px] tracking-wide`}>
        <div className='flex flex-row justify-between w-10/12 h-[100%]'>
            <div><Logo/></div>

              <div className={`flex gap-4 flex-row justify-center items-center max-[850px]:hidden ${user ? "hidden":"visible"}`}>
                <button className={`hover:bg-[#333232] transition-all duration-200 bg-[#000000] text-2xl font-semibold px-4 py-2 text-white rounded-full text-[17px] tracking-wide
                `}
                onClick={()=> navigate("/login")} disabled={loading}>Log in</button>
                <button className='text-xl font-semibold p-1 font-sans'
                onClick={()=> navigate("/signup")} disabled={loading}>Sign up</button>
              </div>

             <div className={`flex gap-4 flex-row justify-center items-center  ${user ? "flex" : "min-[851px]:hidden"}`}>
              <div className={`relative `} onClick={(e) => e.stopPropagation()} ref={ref}> 
                <button disabled={loading}><RiMenu3Line className='text-4xl max-[380px]:text-3xl' onClick={()=> setMenuActive(!menuActive)} /></button>
                  {
                    menuActive ?  
                    <div className=' z-[100] absolute w-[240px] top-[110%] right-[0%] tracking-widest text-lg border-gray-500 border-1 text-[#ffffff] bg-[#000000]'>
                       <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2 p-4 cursor-pointer min-[851px]:hidden
                       ${user ? "hidden":"visible"}  max-[380px]:p-3`}
                       onClick={()=> {
                        navigate("/login")
                        setMenuActive(false);
                      }}><BiLogIn className='text-2xl max-[380px]:text-xl'/>Log in</div>

                     <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2 p-4 cursor-pointer
                     ${user ? "hidden":"visible"}  min-[851px]:hidden max-[380px]:p-3`}
                       onClick={()=> {
                        navigate("/signup")
                        setMenuActive(false);
                      }}><SiGnuprivacyguard className='text-2xl max-[380px]:text-xl'/>Sign up</div>



                       <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2 p-4 cursor-pointer  
                       ${user && user?.role && user?.role == ACCOUNT_TYPE.RECRUITER ? "visible":"hidden"} max-[380px]:p-3` }
                       onClick={()=> {
                        navigate("/dashboard/post-new-job")
                        setMenuActive(false);
                      }}><MdCreateNewFolder className='text-2xl max-[380px]:text-xl'/>Post new job</div>
                     
                       <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2  p-4 cursor-pointer 
                       ${user && user?.role && user?.role == ACCOUNT_TYPE.RECRUITER ? "visible":"hidden"} max-[380px]:p-3`} 
                       onClick={()=>{
                        navigate("/dashboard/view-jobs")
                        setMenuActive(false);
                       } }><HiMiniNumberedList className='text-2xl max-[380px]:text-xl'/>Your jobs</div>
                      
                    <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2 p-4 cursor-pointer  
                    ${user && user?.role && user?.role == ACCOUNT_TYPE.RECRUITER ? "visible":"hidden"} max-[380px]:p-3`}
                    onClick={()=> {
                     navigate(`/dashboard/view-seeker-profile`)
                     setMenuActive(false);
                   }}><MdContentPasteSearch className='text-2xl max-[380px]:text-xl'/>Browse Candidate</div>
                   
                  
                    <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2  p-4 cursor-pointer 
                    ${user && user?.role && user?.role == ACCOUNT_TYPE.SEEKER ? "visible":"hidden"} max-[380px]:p-3`}
                    onClick={()=>{
                     navigate("/dashboard/edit-account")
                     setMenuActive(false);
                    } }><CgProfile className='text-2xl max-[380px]:text-xl'/>Your profile</div>
                    
                
                    <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2 p-4 cursor-pointer  
                    ${user && user?.role && user?.role == ACCOUNT_TYPE.SEEKER ? "visible":"hidden"} max-[380px]:p-3`}
                    onClick={()=> {
                     navigate("/dashboard/saved-jobs")
                     setMenuActive(false);
                   }}><MdSave className='text-2xl max-[380px]:text-xl'/>Saved jobs</div>
                

                   <div className={`hover:bg-[#333232] transition-all duration-200 flex items-center  gap-2 p-4 cursor-pointer
                     ${user ? "visible":"hidden"}  min-[851px]:hidden max-[380px]:p-3`}
                     onClick={()=>{ 
                      signout();
                      setMenuActive(false);
                      }}><LuLogOut className='text-2xl max-[380px]:text-xl'/>Logout</div>
                    </div>:
                     <></>
                  }
              </div>
             <button className={`hover:bg-[#333232] transition-all duration-200 bg-[#000000] text-2xl font-semibold px-4 py-2 text-white  text-[17px] tracking-wide
              max-[850px]:hidden ${user ? "visible":"hidden"} `}
                onClick={()=> signout()} disabled={loading}>
                  Log out
              </button>
              
             </div>

           
            
        </div>
    </div>
  )
}

export default Header