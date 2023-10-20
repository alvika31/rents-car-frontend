import React, {  useState, Fragment } from 'react'
import hero from '../hero.png'
import { IconUser, IconLock, IconEye, IconEyeOff  } from '@tabler/icons-react';
import { Navigate, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import { useMutation } from 'react-query';

function LoginAdmin() {
    const [passwordShow, setPasswordShow] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState('')
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
      
      const handleSubmitMutation = useMutation(
        ({ username, password }) => axios.post(`${api}/login/admin`, { username, password }),
        {
          onSuccess: (response) => {
            const { token } = response.data;
            setToken(token);
            const decodedToken = jwt_decode(token);
            localStorage.setItem('role', decodedToken.role);
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setLoggedIn(true);
    
            MySwal.fire({
              title: <strong>Success Login</strong>,
              html: 'Your Success Login',
              icon: 'success',
            });
    
            history('/dashboard/home');
          },
          onError: (error) => {
            setError('Username atau password salah');
            MySwal.fire({
              title: <strong>Login Failed!</strong>,
              html: 'Please enter the correct username and password',
              icon: 'error',
            });
          },
        }
      );
      const handleSubmit = async (e) => {
        e.preventDefault();
        handleSubmitMutation.mutate({ username, password });
      }

      if (loggedIn) {
        return <Navigate to="/dashboard/home" />;
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
                <h1 className='text-black font-bold text-3xl'>Login Admin</h1>
                <p className='text-gray-500 text-base mt-3'>Please enter correct username and password</p>
                <form onSubmit={handleSubmit}>
                <div className='inline-flex w-full mt-10'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconUser className='text-blue-500'/>
                    </div>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' placeholder='Masukan Username' /> 
                </div>
                <div className='inline-flex w-full mt-5'>
                <div className='bg-white rounded p-1 absolute z-10 mx-1 my-1'>
                    <IconLock className='text-blue-500'/>
                    </div>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-100 focus:outline-0 py-2 rounded relative pl-12' id='password' placeholder='Masukan Password' />
                    <button type='button' className='absolute right-72 mt-2 text-gray-700' onClick={() => showPassword()}>{passwordShow === true ? <IconEye className=''/> : <IconEyeOff className=''/>}</button>
                    {/* <IconEye className='absolute right-72 mt-2'/>  */}
                </div>
                <div className='text-end mt-2'>
              
                </div>
                <button type='submit' className='text-center w-full bg-blue-500 text-white py-3 rounded-lg mt-2 hover:bg-blue-600'>Login</button>
                </form>
                
            </div>
            </div>
        </div>
    </div>
  )
}

export default LoginAdmin