import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    jobApplicants: null,
    applicantSearch: null
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setJobApplicants(state, value) {
            state.jobApplicants = value.payload;
        },
        setApplicantSearch(state, value){
            state.applicantSearch = value.payload;
        }
    },
});

export const {setUser,setJobApplicants,setApplicantSearch} = profileSlice.actions;
export default profileSlice.reducer;