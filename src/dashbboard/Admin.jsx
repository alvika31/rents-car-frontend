import React, {useState, Fragment } from 'react'
import { IconEdit, IconTrashX, IconEye, IconEyeOff } from '@tabler/icons-react';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Dialog, Transition } from '@headlessui/react'
import Button from '../components/Button';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';

function Admin() {
  const [dataAdmin, setDataAdmin] = useState([]);
  const [modalInsert, setModalInsert] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [passwordShow, setPasswordShow] = useState(false)
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [id, setId] = useState("")
  const MySwal = withReactContent(Swal)

  const queryClient = useQueryClient();


  const api = process.env.REACT_APP_API_ENDPOINT;


  
  const insertAdminMutation = useMutation((newAdmin) => axios.post(`${api}/admins`, newAdmin), {
    onSuccess: () => {
      MySwal.fire({
        title: <strong>success!</strong>,
        html: <i>Data Berhasil Dimasukan</i>,
        icon: 'success',
      });
      setModalInsert(false);
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      queryClient.invalidateQueries('admins');
    },
    onError: (error) => {
      MySwal.fire({
        title: <strong>Gagal</strong>,
        html: <i>Data Gagal Dimasukan!</i>,
        icon: 'error',
      });
      console.log(error.message);
    }
  })

  const getAdmin = async () => {
    try {
      const {data} = await axios.get(`${api}/admins`);
      return data
    } catch (error) {
      console.log(error)
    } 
  }

  const insertAdmin = async (e) => {
    e.preventDefault()
    
    const newAdmin = {
      full_name: fullName,
      username: username,
      email: email,
      password: password
    }
    insertAdminMutation.mutate(newAdmin)
  }

  const deleteAdminMutation = useMutation((id) => axios.delete(`${api}/admins/${id}`), {
    onSuccess: () => {
      MySwal.fire('Deleted!', 'Your file has been deleted.', 'success');
        queryClient.invalidateQueries('admins');
    },
    onError: (error) => {
      console.log(error.message)
    }
  })


  const deleteAdmin = async (id) => {
    try {
      MySwal.fire({
        title: "Apakah Anda Yakin Ingin Menghapus?",
        text: "Sudah dihapus tidak bisa kembali loh",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed){
          deleteAdminMutation.mutate(id);
        }
      })
    } catch (error) {
      console.log(error.message)
    }
  }
 
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

  const handleUpdate = (id) => {

    const itemAdmin = data.find((item) => item.id === id)
    
    setModalUpdate(true)
    setFullName(itemAdmin.full_name)
    setUsername(itemAdmin.username)
    setEmail(itemAdmin.email)
    setId(itemAdmin.id)
  }

  const updateAdminMutation = useMutation((data) => {
    const {id, fullName, username, email, password} = data;
    let newAdmin;
    if(password === ''){
      newAdmin = {
        full_name: fullName,
        username: username,
        email: email
      };
    }else{
      newAdmin = {
        full_name: fullName,
        username: username,
        email: email,
        password: password
      };
    };
    return axios.put(`${api}/admins/${id}`, newAdmin)
  }, {
    onSuccess: () => {
      setModalUpdate(false);
      setFullName('');
      setUsername('');
      setEmail('');
      setId('');
      setPassword('');
      MySwal.fire('Updated!', 'Admin Success Updated', 'success');
      queryClient.invalidateQueries('admins');
    }, 
    onError: (error) => {
      console.log(error);
    },
  })

  const doUpdateAdmin = async (e) => {
    e.preventDefault()
    updateAdminMutation.mutate({id, fullName, username, email, password});
  }

  const openModalInsert = () => {
    setModalInsert(true)
    setFullName("")
    setUsername("")
    setEmail("")
    setId("")
  }

  const {data, isLoading, isError} = useQuery('admins', getAdmin);
  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error Fetching Data..</p>
  return (
    <div>
       <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl'>Data Admin</h1>
       <button onClick={() => openModalInsert()} className='bg-green-500 text-white px-4 py-3 font-poppins inline-flex rounded-md mt-10 mb-10'>Tambah Admin</button>
       <div className='bg-white drop-shadow-2xl p-10 rounded-md border-t-4 border-blue-500'>
          <table className='min-w-full divide-y divide-gray-200'>
          <thead>
            <tr>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
                No
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
                Nama Lengkap
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
              Username
              </th>
             
             
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
              Email
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
              Action
              </th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
              <tr key={index}>
              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">{item.full_name}</td>
              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">{item.username} </td>
              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">{item.email} </td>
             
              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
              <button onClick={() => handleUpdate(item.id)} className='border border-gray-200 p-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white'><IconEdit/></button>
            <button onClick={() => deleteAdmin(item.id)} className='border border-gray-200 p-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white ml-2'><IconTrashX/></button>
            
              </td>

            </tr>
            ))}
            </tbody>
           
          </table>
       </div>
       <Transition appear show={modalInsert} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setModalInsert(false)}>
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
                   Tambah Admin
                  </Dialog.Title>
                  <form onSubmit={insertAdmin}>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                  
                    <div className=''>
                    <label className='text-slate-600 text-base'>Full Name:</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                    <div className=''>
                    <label className='text-slate-600 text-base'>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                    <div className=''>
                    <label className='text-slate-600 text-base'>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                    <div className=''>
                    <label className='text-slate-600 text-base'>Password:</label>
                    <div className='flex gap-1 w-full relative py-1 px-3 ring-1 ring-gray-300 rounded-md'>
                    <button type='button' onClick={() => showPassword()}>{passwordShow === true ? <IconEye/> : <IconEyeOff/>}</button>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id='password' className='w-full focus:outline-none focus:ring-white'/>
                    </div>
                    </div>
                     
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white">
                      Save Admin
                    </button>
                    <button type='button'
                      className="ml-2 border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white" onClick={() => setModalInsert(false)}>
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
      <Transition appear show={modalUpdate} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setModalUpdate(false)}>
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
                  Edit Data Admin
                  </Dialog.Title>
                  <form onSubmit={doUpdateAdmin}>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                  
                    <div className=''>
                    <label className='text-slate-600 text-base'>Full Name:</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    <input type='hidden' value={id} onChange={(e) => setId(e.target.value)} />
                    </div>
                    <div className=''>
                    <label className='text-slate-600 text-base'>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                    <div className=''>
                    <label className='text-slate-600 text-base'>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full py-1 px-3 ring-1 ring-gray-300 rounded-md'/>
                    </div>
                    <div className=''>
                    <label className='text-slate-600 text-base'>Password:</label>
                    <div className='flex gap-1 w-full relative py-1 px-3 ring-1 ring-gray-300 rounded-md'>
                    <button type='button' onClick={() => showPassword()}>{passwordShow === true ? <IconEye/> : <IconEyeOff/>}</button>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id='password' className='w-full focus:outline-none focus:ring-white'/>
                    </div>
                    </div>
                     
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white">
                      Save Admin
                    </button>
                    <button type='button'
                      className="ml-2 border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white" onClick={() => setModalUpdate(false)}>
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

export default Admin