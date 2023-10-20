import React, { useState, Fragment } from 'react'
import hero from '../hero.png'
import { IconUser, IconLock, IconEye, IconEyeOff, IconMail, IconBrandWhatsapp, IconId} from '@tabler/icons-react';
import {  useNavigate  } from 'react-router-dom';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import { useMutation } from 'react-query';

function Register() {
    const [passwordShow, setPasswordShow] = useState(false)
    const [namaLengkap, setNamaLengkap] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [whatsapp, setWhatsapp] = useState("")
    const [token, setToken] = useState("")
    const [error, setError] = useState(null);
    const [popupVerifikasi, setPopupVerifikasi] = useState(false)
    const [errorForm, setErrorForm] = useState({})

    const MySwal = withReactContent(Swal)
    const history = useNavigate()
    const api = process.env.REACT_APP_API_ENDPOINT;
    

    const showPassword = () => {
        let password = document.getElementById('password')
        if(password.type === 'password'){
          password.type = 'text'
          setPasswordShow(true)
        }else{
          password.type = 'password'
          setPasswordShow(false)
        }
      }
    
   
    const verifyTokenMutation = useMutation((dataToken) => axios.post(`${api}/verifikasi`, dataToken), {
      onSuccess: () => {
        setPopupVerifikasi(false)
        MySwal.fire({
          title: <strong>Verication Success!</strong>,
          html: 'Please Login!',
          icon: "success",
        });
        history('/login')
      },
      onError: (error) => {
        MySwal.fire({
          title: <strong>Verification Failed!</strong>,
          html: 'Please enter the correct token',
          icon: "error",
        });
      }
    })
    const verifikasiToken = async (e) => {
      e.preventDefault()
      const dataToken = {
        token: token
      }
      verifyTokenMutation.mutate(dataToken);
     
      }
    

    const insertRegistrationMutation = useMutation((dataKostumer) => axios.post(`${api}/kostumers`, dataKostumer), {
      onSuccess: () => {
        setPopupVerifikasi(true)
      },
      onError: (error) => {
        if(error.response.data.message === 'Email already registered'){
          setError('Email already registered')
        }else if(error.response.data.message === 'Username already registered'){
          setError('Username already registered')
        }else{
          setError('Bad Request')
        }
      }
    })
    
    const insertKostumer = async (e) => {
        e.preventDefault()
       
        const dataKostumer = {
            nama_lengkap: namaLengkap,
            username: username,
            password: password,
            email: email,
            whatsapp: whatsapp
        }
        const kostumerEmpty = {
          
        }
        if(dataKostumer.nama_lengkap.trim() === ''){
          kostumerEmpty.nama_lengkap = 'Nama Lengkap Wajib Diisi'
        }
        if(dataKostumer.username.trim() === ''){
          kostumerEmpty.username = 'Username Wajib Diisi'
        }
        if(dataKostumer.password.trim() === ''){
          kostumerEmpty.password = 'Password Wajib Diisi'
        }
        if(dataKostumer.email.trim() === ''){
          kostumerEmpty.email = 'Email Wajib Diisi'
        }
        if(dataKostumer.whatsapp.trim() === ''){
          kostumerEmpty.whatsapp = 'Whatsapp Wajib Diisi'
        }
        setErrorForm(kostumerEmpty)
        insertRegistrationMutation.mutate(dataKostumer);
        
    }
  return (
    <div>
        <div className='flex h-screen w-full items-center justify-center'>
            <div className='bg-gray-100 w-1/2 h-screen m-auto'>
                <h1 className='text-xl font-bold ml-20 mt-20'>RENT CAR</h1>
                <div className='bg-white rounded-md w-1/2 py-10 px-10 text-center mx-auto mt-40'>
                <img alt='' src={hero} className='w-full mx-auto' />
                </div>
            </div> 
            <div className='bg-white w-1/2 p-40 items-center'>
            <div className='max-w-lg'>
                <h1 className='text-black font-bold text-3xl'>Sign Up</h1>
                <p className='text-gray-500 text-base mt-3'>Please fill in your identity!</p>
                <form onSubmit={insertKostumer}>
                {error && <div className='bg-red-500 p-4 rounded text-white font-semibold mt-5 '>{error}</div>}
                <div className='inline-flex w-full mt-10'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconId className='text-blue-500'/>
                    </div>
                    <input type='text' value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' placeholder='Full Name' />
                  
                </div>
                {errorForm.nama_lengkap && <span className='text-red-500 text-sm'>{errorForm.nama_lengkap}</span>} 
                <div className='inline-flex w-full mt-5'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconUser className='text-blue-500'/>
                    </div>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' placeholder='Username' /> 
                </div>
                {errorForm.username && <span className='text-red-500 text-sm'>{errorForm.username}</span>} 
                <div className='inline-flex w-full mt-5'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconLock className='text-blue-500'/>
                    </div>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' id='password' placeholder='Password' />
                    <button type='button' className='absolute right-72 mt-2 text-gray-700' onClick={() => showPassword()}>{passwordShow === true ? <IconEye className=''/> : <IconEyeOff className=''/>}</button>
                    {/* <IconEye className='absolute right-72 mt-2'/>  */}
                </div>
                {errorForm.password && <span className='text-red-500 text-sm'>{errorForm.password}</span>} 
                <div className='inline-flex w-full mt-5'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconMail className='text-blue-500'/>
                    </div>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' placeholder='Email' /> 
                </div>
                {errorForm.email && <span className='text-red-500 text-sm'>{errorForm.email}</span>} 
                <div className='inline-flex w-full mt-5'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconBrandWhatsapp className='text-blue-500'/>
                    </div>
                    <input type='number' value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' placeholder='No Whatsapp' /> 
                </div>
                {errorForm.whatsapp && <span className='text-red-500 text-sm'>{errorForm.whatsapp}</span>} 
                <button type='submit' className='mt-5 text-center w-full bg-blue-500 text-white py-3 rounded-lg mt-2 hover:bg-blue-600'>Sign Up</button>
                </form>
                <div className='inline-flex justify-center gap-2 mt-5'>
                <p className='text-gray-500'>Already have an account? </p> <NavLink to="/login" className='text-blue-500 font-semibold'>Login</NavLink>
                </div>
            </div>
            </div>
        </div>
        <Transition appear show={popupVerifikasi} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setPopupVerifikasi(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-1/2 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                  <div className='bg-yellow-500 text-white p-4 rounded'>Kami Telah Mengirimkan Kode Verifikasi Ke Email Kamu</div>
                  </Dialog.Title>
                  <form onSubmit={verifikasiToken}>
                  <div className="mt-5">
                  
                    <div className=''>
                    <label className='text-slate-600 text-base'>Kode Verifikasi:</label>
                    <input type="text" value={token} onChange={(e) => setToken(e.target.value)} className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                   
                     
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white">
                      Send Verifikasi
                    </button>
                    <button type='button'
                      className="ml-2 border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white" onClick={() => setPopupVerifikasi(false)}>
                     Cancel
                    </button>
                  </div>
                  </form> 
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default Register