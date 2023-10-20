import React, {  useState, Fragment } from 'react'
import { IconEdit, IconTrashX, IconEye, IconEyeOff } from '@tabler/icons-react';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Dialog, Transition } from '@headlessui/react'
import Button from '../components/Button';
import { Navigate } from 'react-router-dom';

function Promo() {
    const api = process.env.REACT_APP_API_ENDPOINT;
    const [dataPromo, setDataPromo] = useState([]);

//    useEffect(() => {
//     getAllPromo()
//    }, [])

    const getAllPromo = async () => {
        try {
            const response = await axios.get(`${api}/promo`);
            setDataPromo(response.data.dataPromo)
            console.log(response.data.dataPromo)
        } catch (error) {
            console.log(error)
        }
    }
    return <>
    <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl'>Data Promo</h1>
    <div className='grid grid-cols-4 gap-5'>
        {dataPromo.map((item, index) => (
            <div key={index} className='flex gap-y-3 flex-col justify-between bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-10'>
            <img src={item?.car?.image} alt=""/>
            </div>
        ))}
    </div>
    </>
}
export default Promo