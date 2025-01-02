import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Closeroute = ({children}) => {
    const {token} = useSelector((state)=> state.auth);
    if(token===null){
         return <Navigate to="/"/>;
    }
    else{
        return children;
    }
}

export default Closeroute