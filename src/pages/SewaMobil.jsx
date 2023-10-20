import axios from 'axios';
import React, {useState} from 'react'
import {  useNavigate,  useParams   } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { IconArmchair, IconAppWindowFilled, IconAdjustmentsHorizontal, IconReceipt2, IconFileDescription  } from '@tabler/icons-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient,} from 'react-query';



function SewaMobil() {
  const queryClient = useQueryClient();
    const { namaMobil } = useParams();
    const api = process.env.REACT_APP_API_ENDPOINT;
    const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
    const MySwal = withReactContent(Swal)
    const [errorForm, setErrorForm] = useState({})
    const history = useNavigate()

    const handleDayClick = (day) => {
        if (!selectedRange.from) {
          setSelectedRange({ from: day, to: null });
        } else if (!selectedRange.to && day > selectedRange.from) {
          setSelectedRange({ ...selectedRange, to: day });
        } else {
          setSelectedRange({ from: day, to: null });
        }
      };
    
      const getTotalDays = () => {
        if (selectedRange.from && selectedRange.to) {
          const diffTime = Math.abs(selectedRange.to - selectedRange.from);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        }
        return 0;
      };

      const getRent = async () => {     
          const {data} = await axios.get(`${api}/data-sewa`);
          return data.dataSewa
    }

      const getProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const {data} = await axios.get(`${api}/kostumername`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return data        
        } catch (error) {
            console.log(error)
        }
    }
 

    const formatDate = (dateString) => {
        const formattedDate = moment(dateString).format('YYYY-MM-DD');
        return formattedDate;
      };
      
    
      const addSewaMutation = useMutation(
        (dataBooking) => axios.post(`${api}/sewamobil`, dataBooking),
        {
          onSuccess: () => {
            MySwal.fire({
              title: <strong>Order Successfully Created</strong>,
              html: <i>Please pay for your order</i>,
              icon: "success",
            });
            history('/dashboard-kostumer/pesanan-anda');
            queryClient.invalidateQueries('rent');
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const isBookingConflict = rents.some(
          (rent) =>
            (formatDate(selectedRange.from) >= rent.awal_sewa && formatDate(selectedRange.from) <= rent.akhir_sewa) ||
            (formatDate(selectedRange.to) >= rent.awal_sewa && formatDate(selectedRange.to) <= rent.akhir_sewa) ||
            (formatDate(selectedRange.from) <= rent.awal_sewa && formatDate(selectedRange.to) >= rent.akhir_sewa)
        );
    
        if (isBookingConflict) {
          return MySwal.fire({
            title: <strong>Failed Rent Car!</strong>,
            html: 'the car is already booked on that date',
            icon: "error",
          });
        } else {
          const dataBooking = {
            id_kostumer: profiles.id,
            id_car: cars.id,
            lama_sewa: getTotalDays(),
            total_harga: totalPrice(),
            awal_sewa: formatDate(selectedRange.from),
            akhir_sewa: formatDate(selectedRange.to),
            tanggal_pengembalian: formatDate(selectedRange.to),
            status: 0
          };
          try {
            const bookingEmpty = {};
    
            if (dataBooking.lama_sewa === 0) {
              return MySwal.fire({
                title: <strong>Failed Rent Car!</strong>,
                html: 'please fill out all forms',
                icon: "error",
              });
            }
            setErrorForm(bookingEmpty);
            await addSewaMutation.mutateAsync(dataBooking);
          } catch (error) {
            console.log(error);
          }
        }
      };

   
    const getCar = async () => {
      
            const {data} = await axios.get(`${api}/cars-slug/${namaMobil}`)
           return data.data
       
    }
    const formatRupiah = (e) => {
        return new Intl.NumberFormat('id-ID',
           { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
         ).format(e);
         
      }
    const totalPrice = () => {
        if (selectedRange.from && selectedRange.to) {
            const diffTime = Math.abs(selectedRange.to - selectedRange.from);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const total = diffDays * cars.harga;
            return total
          }
          return 0;
    }
    


  const carQuery = useQuery('car', getCar);
  const profileQuery = useQuery('profile', getProfile);
  const rentQuery = useQuery('rent', getRent);

  if (carQuery.isLoading || profileQuery.isLoading || rentQuery.isLoading) return <p>Loading...</p>;
  if (carQuery.isError || profileQuery.isError || rentQuery.isError) return <p>Error Fetching Data..</p>;

  const cars = carQuery.data;
  const profiles = profileQuery.data;
  const rents = rentQuery.data;
  return (
    <div className='py-20 container'>
        <div className='flex justify-center items-center bg-gray-200 p-10 rounded-md mt-10'>
            <div className='w-1/2'>
                 <img src={cars.image} alt='' />
            </div>
            <div className='w-1/2 flex flex-col gap-y-3'>
                 <h1 className='text-4xl font-bold font-poppins mb-3'>{cars.name_car}</h1>
                 <div className='flex items-center gap-x-2'>
                    <div className='bg-white p-1 rounded'>
                    <IconAppWindowFilled className='text-blue-500'/>
                    </div>
                    <h1 className='text-md font-semibold  font-poppins'>Vehicle License Plate: {cars.plat}</h1>
                 </div>
               
                 <div className='flex items-center gap-x-2'>
                    <div className='bg-white p-1 rounded'>
                    <IconArmchair className='text-blue-500'/>
                    </div>
                    <h1 className='text-md font-semibold  font-poppins'>Seat: {cars.seat} Seat</h1>
                 </div>
                 <div className='flex items-center gap-x-2'>
                    <div className='bg-white p-1 rounded'>
                    <IconAdjustmentsHorizontal className='text-blue-500'/>
                    </div>
                    <h1 className='text-md font-semibold  font-poppins'>Car Type: {cars.tipe_mobil}</h1>
                 </div>
                 <div className='flex items-center gap-x-2'>
                    <div className='bg-white p-1 rounded'>
                    <IconReceipt2 className='text-blue-500'/>
                    </div>
                    <h1 className='text-md font-semibold  font-poppins'>Price: {formatRupiah(cars.harga)} / Hari</h1>
                 </div>
                 <div className='flex items-center gap-x-2'>
                    <div className='bg-white p-1 rounded'>
                    <IconFileDescription className='text-blue-500'/>
                    </div>
                   
                    <p dangerouslySetInnerHTML={{ __html: cars.deskripsi }} className='text-md font-poppins'></p>
                 </div>
            </div>

        </div>
        <div className='my-20 bg-gray-100 p-20 '>
        <h1 className='text-4xl font-bold font-poppins mb-3 text-center'>Book Now</h1>
      
        <form className='font-poppins mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10' onSubmit={handleSubmit}>
            <div className='flex flex-col justify-center '>
                <h1 className='text-xl font-bold  font-poppins mb-5'>Length of Lease:</h1>
                <div className='bg-white p-5 rounded-md drop-shadow'>
                    <DayPicker
            selected={selectedRange} mode="range" onDayClick={handleDayClick} 
            numberOfMonths={1} pagedNavigation
            />
            {selectedRange.from && selectedRange.to && (
            <p>Total days: {getTotalDays()}</p>
        )}
       
            </div>
            {errorForm.lama_sewa && <span className='text-red-500 text-sm'>{errorForm.lama_sewa}</span>} 
            </div>
            <div>
            <label className='text-xl font-bold  font-poppins'>Total Price:</label>
            <div className='flex border border-gray-300 bg-white py-1 rounded-md mt-2 mt-5'>
                <div className='bg-gray-300 p-1 ml-1 rounded text-black'>
                    <IconReceipt2 className=''/>
                    </div>
                    <input type='text' value={formatRupiah(totalPrice())} className='w-full focus:outline-0 font-poppins ml-3' readOnly/>
                </div>
            <button type='submit' className="bg-blue-500 font-poppins text-white rounded-md py-1 px-2 mt-5">Booking Now</button>
                </div>
        </form>
        {/* <button  onClick={handlePayment} className="bg-blue-500 font-poppins text-white rounded-md py-1 px-2 mt-5">Booking Sekarang</button> */}
        </div>
   
    </div>
  )
}

export default SewaMobil