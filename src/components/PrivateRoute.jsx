import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'



export  function PrivateRoutes() {
    let  userid = localStorage.getItem("token") == null ? false : true;
    return (
        <>
            {userid ? <Outlet  /> : <Navigate to="/login" />};
        </>

    )
}

export function PrivateRouteKostumer(){
    let userid = localStorage.getItem('role') === 'kostumer' && localStorage.getItem('token') !== null ? true : false
    return (
        <>
            {userid ? <Outlet /> : <Navigate to='/404' />}
        </>
    )
    
}

export function PrivateRouteAdmin(){
    let userid = localStorage.getItem('role') === 'admin' && localStorage.getItem('token') !== null ? true : false
    return (
        <>
            {userid ? <Outlet /> : <Navigate to='/404' />}
        </>
    )
}

export function cekLogin(){
    let  userid = localStorage.getItem("token") == null ? false : true;
    return userid
}