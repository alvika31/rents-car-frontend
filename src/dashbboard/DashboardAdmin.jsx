import React, {  useState, Fragment } from 'react'
import axios from 'axios';
import {
    useQuery,
    useQueryClient,
  } from "react-query";

function DashboardAdmin() {
    const queryClient = useQueryClient();
    const api = process.env.REACT_APP_API_ENDPOINT;
    // const [counts, setcounts] = useState([])

    // useEffect(() => {
    //     getCount()
    // }, [])

    const getCount = async () => {
            const {data} = await axios.get(`${api}/count-data`)
           return data
    }

    const { data, isLoading, isError } = useQuery("counts", getCount);

  
  return (
    <div>
         <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl'>Dashboard</h1>
         <div className='grid grid-cols-4 mt-10 gap-5'>
            <div className='bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-6'>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-md'>Data Booking Sudah Bayar</h1>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-3xl mt-10'>{data?.bookingSuccess}</h1>
            </div>
            <div className='bg-white drop-shadow-lg border-t-4 border-red-500 rounded-md p-6'>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-md'>Data Booking Belum Bayar</h1>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-3xl mt-10'>{data?.bookingFailed}</h1>
            </div>
            <div className='bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-6'>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-md'>Data Mobil Tersedia</h1>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-3xl mt-10'>{data?.carAvailable}</h1>
            </div>
            <div className='bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-6'>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-md'>Data Mobil Tidak Tersedia</h1>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-3xl mt-10'>{data?.carNotAvailable
}</h1>
            </div>
            <div className='bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-6'>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-md'>Data Kostumer Terverifikasi</h1>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-3xl mt-10'>{data?.kostumerYes}</h1>
            </div>
            <div className='bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-6'>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-md'>Data Kostumer Tidak Terverifikasi</h1>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-3xl mt-10'>{data?.kostumerNot}</h1>
            </div>
            <div className='bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-6'>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-md'>Data Admin</h1>
                <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-3xl mt-10'>{data?.dataAdmin}</h1>
            </div>
         </div>
    </div>
  )
}

export default DashboardAdmin