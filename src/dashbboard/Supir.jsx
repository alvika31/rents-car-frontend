import React, {  useState, Fragment } from 'react'
import { IconEdit, IconTrashX, IconEye, IconEyeOff } from '@tabler/icons-react';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Dialog, Transition } from '@headlessui/react'
import Button from '../components/Button';
import { Navigate } from 'react-router-dom';

function Supir() {
    const api = process.env.REACT_APP_API_ENDPOINT;
    const [supir, setSupir] = useState([])

    // useEffect(() => {
    //     getSupir()
    // }, [])
    const getSupir = async () => {
        try {
            const supirs = await axios.get(`${api}/supirs`);
            setSupir(supirs.data)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
    <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl'>Data Supir</h1>
    <button className='bg-green-500 text-white px-4 py-3 font-poppins inline-flex rounded-md mt-10 mb-10'>Tambah Supir</button>
    <div className='bg-white drop-shadow-2xl p-10 rounded-md border-t-4 border-blue-500'>
   
    <table className='min-w-full divide-y divide-gray-200'>
      <thead>
        <tr>
        <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>
            No
          </th>
          <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>
            Nama Lengkap
          </th>
         
          <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>No Whatsapp</th>
          <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Status</th>
          <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Foto</th>
          <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Action</th>
        </tr>
      </thead>
      <tbody>
      {supir.map((items, index) => (
      <tr key={index}>
        <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{index + 1}</td>
        <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{items.nama_lengkap}</td>
        <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{items.no_whatsapp}</td>
        <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>
          <div className= {
          items.status === 1 ? 'bg-green-500 text-white text-sm rounded p-1 inline-flex' : 'bg-red-500 text-white text-sm rounded p-1 inline-flex'
          }>{
          items.status === 1 ? 'Tersedia' : 'Tidak Tersedia'
          }</div></td>
        <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>
        <img src={items.foto} width={'100px'} alt='' />
        
        </td>
       
        <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>
          {/* <button onClick={() => deleteKostumer(items.id)} className='border border-gray-200 p-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white ml-2'><IconTrashX/></button> */}
        </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
  </div>
  )
}

export default Supir