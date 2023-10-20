import React, { useState, Fragment} from 'react'
import hero from '../hero.png'
import { IconUser, IconLock, IconEye, IconEyeOff  } from '@tabler/icons-react';
import {  useNavigate, NavLink  } from 'react-router-dom';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { Dialog, Transition } from '@headlessui/react'
import jwt_decode from "jwt-decode";
import { useMutation } from 'react-query';

function Login() {
    const [passwordShow, setPasswordShow] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [popupVerifikasi, setPopupVerifikasi] = useState(false)
    const [popupToken, setPopupToken] = useState(false)
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
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
          setPopupToken(false)
          MySwal.fire({
            title: <strong>Verification Successful!</strong>,
            html: 'Please Login',
            icon: "success",
          });
        history('/login')
        },
        onError: (error) => {
          if(error.response.data.message === 'Input Token Required'){
            setError('')
          }
          else if(error.response.data.message === 'Token Tidak Ditemukan'){
            setError('Token Not Found');
        }
        }
      })
      const verifikasiToken = async (e) => {
        e.preventDefault()
        const dataToken = {
          token: token
        }
        const notInput = {}
        if(dataToken.token.trim() === ''){
          notInput.token = 'Token Required'
        }
        setErrorForm(notInput)
        verifyTokenMutation.mutate(dataToken);
       
    }

    const loginMutation = useMutation((dataInput) => axios.post(`${api}/login`, dataInput), {
      onSuccess: (response) => {
        const { token } = response.data;
        setToken(token);
        const decodedToken = jwt_decode(token);
        localStorage.setItem('role', decodedToken.role);

        const is_verifikasi = response.data.is_verifikasi;
        if (!is_verifikasi) {
          setError('Please verify your account before logging in.');
          return;
        }
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        setLoggedIn(true);

        MySwal.fire({
          title: <strong>Berhasil Login!</strong>,
          html: 'Anda Berhasil Login',
          icon: 'success',
        });

        history('/dashboard-kostumer/home');
      },
      onError: (error) => {
        if(error.response.data.message === 'Username atau password salah!'){
          setError('Incorrect Username or Password')
        }
        if(error.response.data.message === 'Akun Belum Terverifikasi'){
          setError('');
          setPopupVerifikasi(true)
          
        }
      }
    })
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const dataInput = {
          username: username,
          password: password
        }

        const notInput = {}

        if(dataInput.username.trim() === ''){
          notInput.username = 'Username Required'
        }
        if(dataInput.password.trim() === ''){
          notInput.password = 'Password Required'
        }
        setErrorForm(notInput)
        loginMutation.mutate(dataInput);
        
      }
      

      const sendTokenMutation = useMutation((dataInput) => axios.post(`${api}/sendverifikasi`, dataInput), {
        onSuccess: () => {
          setPopupVerifikasi(false)
          setPopupToken(true)
          setError('');
          setEmail('')
          setToken('')
        },
        onError: () => {
          if(error.response.data.message === 'Input Email Required'){
            setError('')
          }
          else if(error.response.data.message === 'email tidak terdaftar'){
            setError('Email Tidak Terdaftar');
          }else if(error.response.data.message === 'email terverifikasi'){
            setError('Akun Sudah Aktif');
          }
        }
      })
      const sendToken = async (e) => {
        e.preventDefault()
       
        const dataInput = {
          email: email,
        }
        const notInput = {}
        if(dataInput.email.trim() === ''){
          notInput.email = 'Email Required'
        }
        setErrorForm(notInput)
        sendTokenMutation.mutate(dataInput)
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
                <h1 className='text-black font-bold text-3xl'>Welcome Back!</h1>
                <p className='text-gray-500 text-base mt-3'>Please enter the correct Username and Password!</p>
                <form onSubmit={handleSubmit}>
                {error && <div className='bg-red-500 p-4 rounded text-white font-semibold mt-5 '>{error}</div>}
                <div className='inline-flex w-full mt-10'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconUser className='text-blue-500'/>
                    </div>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' placeholder=' Username' /> 
                    
                </div>
                {errorForm.username && <span className='text-red-500 text-sm'>{errorForm.username}</span>} 
                <div className='inline-flex w-full mt-5'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconLock className='text-blue-500'/>
                    </div>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' id='password' placeholder=' Password' />
                 
                    <button type='button' className='absolute right-72 mt-2 text-gray-700' onClick={() => showPassword()}>{passwordShow === true ? <IconEye className=''/> : <IconEyeOff className=''/>}</button>
                    {/* <IconEye className='absolute right-72 mt-2'/>  */}
                </div>
                {errorForm.password && <span className='text-red-500 text-sm'>{errorForm.password}</span>} 
                <div className='text-end mt-2'>
                <NavLink to="/resetpassword" className='font-semibold text-blue-500'>Forgot Password?</NavLink>
                </div>
                <button type='submit' className='text-center w-full bg-blue-500 text-white py-3 rounded-lg mt-2 hover:bg-blue-600'>Login</button>
                </form>
                <div className='inline-flex justify-center gap-2 mt-5'>
                <p className='text-gray-500'>Not Have Account? </p> <NavLink to="/register" className='text-blue-500 font-semibold'>Sign Up</NavLink>
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
                  <div className='bg-yellow-500 text-white p-4 rounded'>Your Account is Not Verified, Enter Your Email!</div>
                  </Dialog.Title>
                  <form onSubmit={sendToken}>
                  <div className="mt-5">
                  {error && <div className='bg-red-500 p-4 rounded text-white font-semibold mt-5 '>{error}</div>}
                    <div className=''>
                    <label className='text-slate-600 text-base'>Email:</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                  </div>
                  {errorForm.email && <span className='text-red-500 text-sm'>{errorForm.email}</span>} 

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white">
                      Send Verication
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
      <Transition appear show={popupToken} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setPopupToken(false)}>
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
                  <div className='bg-yellow-500 text-white p-4 rounded'>We Have Sent the Token to Your Email, Please Feedback </div>
                  </Dialog.Title>
                  <form onSubmit={verifikasiToken}>
                  {error && <div className='bg-red-500 p-4 rounded text-white font-semibold mt-5 '>{error}</div>}
                  <div className="mt-5">
                    <div className=''>
                    <label className='text-slate-600 text-base'>Token:</label>
                    <input value={token} onChange={(e) => setToken(e.target.value)} type="text" className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                  </div>
                  {errorForm.token && <span className='text-red-500 text-sm'>{errorForm.token}</span>} 

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white">
                      Send Verifikasi
                    </button>
                    <button
                      className="ml-2 border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white" onClick={() => setPopupToken(false)}>
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

export default Login