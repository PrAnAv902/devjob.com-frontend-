import {  Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EditAccount from "../src/components/dashboard/EditAccount";
import PostNewJob from "../src/components/dashboard/PostNewJob";
import ViewRecruiterJobs from "../src/components/dashboard/ViewRecruiterJobs";
import SavedJobs from "./components/dashboard/SavedJobs";
import RecruiterJob from "./components/dashboard/RecruiterJob";
import Notfound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/core/Header";
import Openroute from "./routes/Openroute";
import Openjob from "./components/common/Openjob"
import ResetPassword from "./components/core/ResetPassword";
import {  useSelector } from "react-redux";
import {ACCOUNT_TYPE} from "./Utils/Constants";
import Closeroute from "./routes/Closeroute";
import ViewSeekerProfile from "./components/dashboard/ViewSeekerProfile";
import JobApplicants from "./components/dashboard/JobApplicants";



function App() {

  const { user } = useSelector(state => state.profile);
  const { token } = useSelector(state => state.auth);


  

  return (
    <div className="w-screen h-[100vh] relative select-none overflow-x-hidden" >
      {
        <Header/>
      }
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Openroute><Login/></Openroute>}></Route>
            <Route path="/signup" element={<Openroute><Signup/></Openroute>}></Route>
            <Route path="/job/:id" element={<Openjob/>}></Route>
            <Route path="/reset-password/:id" element={<Openroute><ResetPassword/></Openroute>}></Route>
            <Route element={<Dashboard/>}>
                {/* Recruiter routes inside Dashboard */}
                {
                  token && user && user?.role === ACCOUNT_TYPE.RECRUITER && 
                  <> 
                    <Route path="/dashboard/post-new-job" element={<Closeroute><PostNewJob/></Closeroute>}></Route>
                    <Route path="/dashboard/view-jobs" element={<Closeroute><ViewRecruiterJobs/></Closeroute>}></Route> 
                    <Route path="/dashboard/view-seeker-profile" element={<Closeroute><ViewSeekerProfile/></Closeroute>}></Route>
                    <Route path="/dashboard/edit-job/:id" element={<Closeroute><RecruiterJob/></Closeroute>}></Route>  
                  </>
                }
                {/* Seeker routes inside Dashboard */}
                {
                  token && user && user?.role === ACCOUNT_TYPE.SEEKER && 
                  <> 
                    <Route path="/dashboard/saved-jobs" element={<Closeroute><SavedJobs/></Closeroute>}></Route>
                    <Route path="/dashboard/edit-account" element={<Closeroute><EditAccount/></Closeroute>}></Route>
    
                  </>        
                }
                

               
            </Route>
            <Route path="*" element={<Notfound/>}></Route>
      </Routes>  

      <JobApplicants/>
    </div>
  );
}

export default App;
