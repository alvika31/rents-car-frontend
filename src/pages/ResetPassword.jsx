import React, { useState, Fragment } from 'react'
import hero from '../hero.png'
import {IconMail    } from '@tabler/icons-react';
import { Navigate, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'
import { useMutation } from 'react-query';

function ResetPassword() {
    const [passwordShow, setPasswordShow] = useState(false)

    const [error, setError] = useState('');

    const [popupToken, setPopupToken] = useState(false)
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [errorForm, setErrorForm] = useState({})
    const MySwal = withReactContent(Swal)
    const history = useNavigate()
    const api = process.env.REACT_APP_API_ENDPOINT;


    const handleSubmitMutation = useMutation((dataInput) => axios.post(`${api}/resetpassword`, dataInput), {
      onSuccess: () => {
        MySwal.fire({
          title: <strong>Password Success Reset</strong>,
          html: 'We have sent a new password to your email. Please Login',
          icon: "success",
        });
      },
      onError: (error) => {
        if(error.response.data.message === 'Email Not Found'){
          setError('Email Not Registered')
        }
        if(error.response.data.message === 'Email Required'){
          setError('');
          
        }
      }
    })
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const dataInput = {
          email: email,
         
        }
        const notInput = {}
        if(dataInput.email.trim() === ''){
          notInput.email = 'Email Required'
        }
        setErrorForm(notInput)
        handleSubmitMutation.mutate(dataInput);
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
                <h1 className='text-black font-bold text-3xl'>Reset Password</h1>
                <p className='text-gray-500 text-base mt-3'>Enter your email, we'll send you a new password.</p>
                <form onSubmit={handleSubmit}>
                {error && <div className='bg-red-500 p-4 rounded text-white font-semibold mt-5 '>{error}</div>}
                <div className='inline-flex w-full mt-10'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconMail className='text-blue-500'/>
                    </div>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' placeholder='Masukan Email Anda' /> 
                    
                </div>
                {errorForm.email && <span className='text-red-500 text-sm'>{errorForm.email}</span>} 
               
                <button type='submit' className='text-center w-full bg-blue-500 text-white py-3 rounded-lg mt-10 hover:bg-blue-600'>Reset Password</button>
                </form>
                <div className='inline-flex justify-center gap-2 mt-5'>
                <p className='text-gray-500'>Have you reset your password? </p> <NavLink to="/login" className='text-blue-500 font-semibold'>Login</NavLink>
                </div>
            </div>
            </div>
        </div>
        
    </div>
  )
}

export default ResetPassword