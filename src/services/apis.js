const BASE_URL = 'https://devjobs-com.onrender.com';

// PUBLIC ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/public/signup-otp",
  SIGNUP_API: BASE_URL + "/public/signup",
  LOGIN_API: BASE_URL + "/public/login",
  RESETPASSTOKEN_API: BASE_URL + "/public/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/public/reset-password",
  FETCH_JOB_FOR_HOME_API: BASE_URL + "/public/fetch-jobs-for-home",
  FETCH_SEARCH_JOB_NAME_API: BASE_URL + "/public/fetch-search-job-name",
  FETCH_SEARCH_JOB_LOCATION_API: BASE_URL + "/public/fetch-search-job-location",
  FETCH_SPECIFIC_JOB_DETAILS_API: BASE_URL + "/public/specific-job-details"
}

// RECRUITER ENDPOINTS
export const recruiterEndpoints = {
  CREATE_JOB_API: BASE_URL + "/recruiter/create-new-job",
  DELETE_JOB_API: BASE_URL + "/recruiter/delete-job",
  FETCH_COMPANIES_API: BASE_URL + "/recruiter/fetch-companies",
  FETCH_JOB_APPLICANTS_API: BASE_URL + "/recruiter/fetch-applicants-list",
  CHANGE_JOB_STATUS_API: BASE_URL + "/recruiter/change-job-status",
  GET_EDIT_JOB_DATA_API: BASE_URL + "/recruiter/edit-job-data",
  EDIT_JOB_API: BASE_URL + "/recruiter/edit-job",
  SEARCH_CANDIDATE_API: BASE_URL + "/recruiter/search-candidate"
}

// SEEKER ENDPOINTS
export const seekerEndpoints = {
    APPLY_JOB_API: BASE_URL + "/seeker/apply",
    SAVE_JOB_API: BASE_URL + "/seeker/save",
    UNSAVE_JOB_API: BASE_URL + "/seeker/unsave",
    UPDATE_PROFILE_API: BASE_URL + "/seeker/update-profile"
}


