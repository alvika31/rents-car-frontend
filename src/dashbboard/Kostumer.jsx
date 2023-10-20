import React from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { IconTrashX } from '@tabler/icons-react';
const api = process.env.REACT_APP_API_ENDPOINT;


function Kostumer() {
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();

  const getKostumer = async () => {
    const { data } = await axios.get(`${api}/kostumers`);
    return data;
  };
 

      const deleteKostumer = async (id) => {
        try {
          const result = await MySwal.fire({
            title: "Apakah Anda Yakin Ingin Menghapus?",
            text: "Sudah dihapus tidak bisa kembali loh",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          });
          if (result.isConfirmed) {
            await axios.delete(`${api}/kostumer-delete/${id}`);
            queryClient.invalidateQueries('kostumers');
            MySwal.fire("Deleted!", "Kostumer Berhasil dihapus", "success");
          }
        } catch (error) {
          console.log(error.message);
        }
      }

  const { data, isLoading, isError } = useQuery('kostumers', getKostumer);
  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;
  
  return (
    <div>
      <h1 className='duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl'>Data Kostumer</h1>
      <div className='bg-white drop-shadow-2xl p-10 rounded-md border-t-4 border-blue-500 mt-10'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>No</th>
              <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Nama Lengkap</th>
              <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Username</th>
              <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Email</th>
              <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Whatsapp</th>
              <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Status Verifikasi</th>
              <th className='px-6 py-3 text-md font-bold text-left uppercase font-poppins'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((items, index) => (
              <tr key={index}>
                <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{index + 1}</td>
                <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{items.nama_lengkap}</td>
                <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{items.username}</td>
                <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{items.email}</td>
                <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>{items.whatsapp}</td>
                <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>
                  <div className={items.is_verifikasi === 1 ? 'bg-green-500 text-white text-sm rounded p-1 inline-flex' : 'bg-red-500 text-white text-sm rounded p-1 inline-flex'}>
                    {items.is_verifikasi === 1 ? 'Terverifikasi' : 'Belum Terverifikasi'}
                  </div>
                </td>
                <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins'>
                  <button onClick={() => deleteKostumer(items.id)} className='border border-gray-200 p-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white ml-2'>
                    <IconTrashX />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Kostumer;