import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios';
import { IconLock, IconUser, IconBrandWhatsapp, IconId, IconGenderBigender,IconMapPinFilled    } from '@tabler/icons-react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Dialog, Transition } from '@headlessui/react'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';

function SettingKostumer() {
    const api = process.env.REACT_APP_API_ENDPOINT
    const queryClient = useQueryClient();
    const [dataProfile, setDataProfile] = useState([])
    const [id, setId] = useState("")
    const [namaLengkap, setNamaLengkap] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [alamat, setAlamat] = useState("")
    const [whatsapp, setWhatsapp] = useState("")
    const [ktp, setKtp] = useState("")
    const [jenisKelamin, setJenisKelamin] = useState("")
    const [password, setPassword] = useState("")
    const MySwal = withReactContent(Swal)
    const [errorForm, setErrorForm] = useState({})
    const [popupEdit, setPopupEdit] = useState(false)

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${api}/kostumername`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setDataProfile(response.data)            
            setId(response.data.id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdata =  (id) => {
      setPopupEdit(true)
       setId(dataProfile.id)
            setNamaLengkap(dataProfile.nama_lengkap)
            // setUsername(dataProfile.username)
            // setEmail(dataProfile.email)
            setAlamat(dataProfile.alamat)
            setWhatsapp(dataProfile.whatsapp)
            setKtp(dataProfile.ktp)
            setJenisKelamin(dataProfile.jenis_kelamin)
    }
    
    const updateMyProfile = async (e) => {
      e.preventDefault()
      const dataForm = {
        id: id,
        nama_lengkap: namaLengkap,
        whatsapp: whatsapp,
        alamat: alamat,
        jenis_kelamin: jenisKelamin,
        ktp: ktp
      }
      try {
        setPopupEdit(false)
        window.location.reload();
          const response = await axios.post(`${api}/updateprofile`, dataForm)
          if(response){
            return MySwal.fire({
              title: <strong>Profile Berhasil Terupdate</strong>,
              html: <i>Profile Anda Berhasil diperbarui</i>,
              icon: "success",
            });
          }else if(response === 0){
            return MySwal.fire({
              title: <strong>Profile Gagal</strong>,
              html: <i>Profile Anda tidak Berhasil diperbarui</i>,
              icon: "error",
            });
          }
      } catch (error) {
        console.log(error)
      }
    }

    const changePasswordMutation = useMutation((dataForm) => axios.post(`${api}/changepassword`, dataForm), {
      onSuccess: () => {
        MySwal.fire({
          title: <strong>Success Password Change</strong>,
          html: <i>Your Password Succes Change!</i>,
          icon: "success",
        });
      },
      onError: (error) => {
        console.log(error)
        MySwal.fire({
          title: <strong>Failed Password Change</strong>,
          html: <i>Your Passowrd Not Change</i>,
          icon: "error",
        });
      }
    })
    const changePassword = async (e) => {
        e.preventDefault()
        const dataForm = {
            id: id,
            password: password
        }
        const notInput = {}
        if(dataForm.password.trim() === ''){
            notInput.password = 'Password Required'
        }
        setErrorForm(notInput)
        changePasswordMutation.mutate(dataForm)
    }
  return (
    <div>
        <h1 className='font-poppins text-black font-extrabold text-4xl'>My Profile</h1>
        <div className='container grid grid-cols-2 gap-10 mt-10'>
            <div className='bg-white drop-shadow-2xl p-10 rounded-md'>
            
                 <h1 className='font-poppins text-xl text-black mb-3 font-bold'>Identitas Saya</h1>
                <h2 className='font-poppins text-md text-slate-500 font-semibold'>Nama Lengkap: {dataProfile.nama_lengkap}</h2>
                <h2 className='font-poppins text-md text-slate-500 font-semibold'>Username: {dataProfile.username}</h2>
                <h2 className='font-poppins text-md text-slate-500 font-semibold'>Email: {dataProfile.email}</h2>
                <h2 className='font-poppins text-md text-slate-500 font-semibold' >Alamat: <span className={dataProfile.alamat === '' ? 'text-red-500' : ''}>{dataProfile.alamat === '' ? 'Data Belum Di Input' : dataProfile.alamat}</span></h2>
                <h2 className='font-poppins text-md text-slate-500 font-semibold'>Whatsapp: {dataProfile.whatsapp}</h2>
                <h2 className='font-poppins text-md text-slate-500 font-semibold'>No KTP: <span className={dataProfile.ktp === '' ? 'text-red-500' : ''}>{dataProfile.ktp === '' ? 'Data Belum Di Input' : dataProfile.ktp}</span></h2>
                <h2 className='font-poppins text-md text-slate-500 font-semibold'>Jenis Kelamin: <span className={dataProfile.jenis_kelamin === '' ? 'text-red-500' : ''}>{dataProfile.jenis_kelamin === '' ? 'Data Belum Di Input' : dataProfile.jenis_kelamin}</span></h2>
                <button onClick={() => handleUpdata(dataProfile.id)} className='font-poppins mt-5 text-center bg-blue-500 text-white w-full py-2 px-3 rounded-lg'>Lengkapi Identitas Diri</button>
            </div>
            <div className='bg-white drop-shadow-2xl p-10 rounded-md'>
            <h1 className='font-poppins text-xl text-black mb-3 font-bold'>Ganti Password</h1>
            <form onSubmit={changePassword}>
                <label className='font-poppins text-md text-slate-500 font-semibold'>New Password:</label>
                <div className='flex border border-gray-300 py-1 rounded-md mt-2'>
                <div className='bg-gray-300 p-1 ml-1 rounded text-black'>
                    <IconLock className=''/>
                    </div>
                    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full focus:outline-0 font-poppins ml-3' />
                </div>
                {errorForm.password && <span className='text-red-500 text-sm'>{errorForm.password}</span>} 
                <button className='font-poppins mt-5 text-center bg-blue-500 text-white w-full py-2 px-3 rounded-lg'>Ganti Password</button>
            </form>
            </div>
        </div>
        <Transition appear show={popupEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setPopupEdit(false)}>
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
                <Dialog.Panel className="w-1/2 transform overflow-hidden rounded-2xl bg-white p-7 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className='font-poppins text-black font-extrabold text-xl mb-5'
                  >
                   Edit My Profile
                  </Dialog.Title>
                  <form onSubmit={updateMyProfile}>
                  <input type='hidden' value={id} onChange={(e) => setId(e.target.value)}/>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                        <label className='font-poppins text-md text-slate-500 font-semibold'>Username: {dataProfile.username}</label>    
                    </div>
                    <div>
                    <label className='font-poppins text-md text-slate-500 font-semibold'>Email: {dataProfile.email}</label>    
                    </div>
                    <div className=''>
                    <label className='font-poppins text-md text-slate-500 font-semibold'>Nama Lengkap:</label>
                        <div className='flex border border-gray-300 py-1 rounded-md mt-2'>
                        <div className='bg-gray-300 p-1 ml-1 rounded text-black'>
                            <IconUser className=''/>
                        </div>
                             <input type='text' value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} className='w-full focus:outline-0 font-poppins ml-3' />
                        </div>
                    </div>
                    <div className=''>
                    <label className='font-poppins text-md text-slate-500 font-semibold'>Whatsapp:</label>
                        <div className='flex border border-gray-300 py-1 rounded-md mt-2'>
                        <div className='bg-gray-300 p-1 ml-1 rounded text-black'>
                            <IconBrandWhatsapp className=''/>
                        </div>
                             <input type='text' value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className='w-full focus:outline-0 font-poppins ml-3' />
                        </div>
                    </div>
                    <div className=''>
                    <label className='font-poppins text-md text-slate-500 font-semibold'>No KTP:</label>
                        <div className='flex border border-gray-300 py-1 rounded-md mt-2'>
                        <div className='bg-gray-300 p-1 ml-1 rounded text-black'>
                            <IconId className=''/>
                        </div>
                             <input type='text' value={ktp} onChange={(e) => setKtp(e.target.value)} className='w-full focus:outline-0 font-poppins ml-3' />
                        </div>
                        {!ktp && (
                            <div>
                                <h1 className='text-red-500 text-sm font-poppins'>* Data KTP Belum Terisi</h1>
                            </div>
                        )}
                    </div>
                    <div className=''>
                    <label className='font-poppins text-md text-slate-500 font-semibold'>Jenis Kelamin:</label>
                        <div className='flex border border-gray-300 py-1 rounded-md mt-2'>
                        <div className='bg-gray-300 p-1 ml-1 rounded text-black'>
                            <IconGenderBigender className=''/>
                        </div>
                            <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className='w-full focus:outline-0 font-poppins ml-3'>
                                <option value="">=== Pilih Jenis Kelamin ===</option>
                                <option value="Pria">Pria</option>
                                <option value="Wanita">Wanita</option>
                            </select>
                           
                        </div>
                        {!jenisKelamin && (
                            <div>
                                <h1 className='text-red-500 text-sm font-poppins'>* Data Jenis Kelamin Belum Terisi</h1>
                            </div>
                        )}
                    </div>
                     
                  </div>
                  <div className='mt-4'>
                  <div className='flex items-center gap-x-2'>
                  <div className='bg-gray-300 p-1 ml-1 rounded text-black'>
                  <IconMapPinFilled />
                  </div>
                  <label className='font-poppins text-md text-slate-500 font-semibold'>Alamat:</label>
                  </div>
                    
                  <textarea className='mt-2 border border-gray-300 py-1 rounded-md w-full h-24 px-2 focus:outline-0 font-poppins' onChange={(e) => setAlamat(e.target.value)} value={alamat}></textarea>
                  {!alamat && (
                            <div>
                                <h1 className='text-red-500 text-sm font-poppins'>* Data Alamat Belum Terisi</h1>
                            </div>
                        )}
                        
                        </div>
                  <div className="mt-4 flex gap-x-2">
                    <button
                      type="submit"
                      className="bg-blue-500 font-poppins text-white rounded-md py-1 px-2">
                      Edit My Profile
                    </button>
                    <button type='button'
                      className="bg-red-500 font-poppins text-white rounded-md py-1 px-2" onClick={() => setPopupEdit(false)}>
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

export default SettingKostumer