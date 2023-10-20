import React, {useState, Fragment} from 'react'
import hero from '../hero.png'
import hiache from '../hiace.png'
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slide1 from '../slide1.jpg'
import slide2 from '../slide2.jpg'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { NavLink,  useNavigate} from 'react-router-dom'
import { IconLock, IconUser, IconBrandWhatsapp, IconId, IconGenderBigender,IconMapPinFilled    } from '@tabler/icons-react';
import { Dialog, Transition } from '@headlessui/react'
import { detailMobil } from './SewaMobil';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';


function Home() {
  const queryClient = useQueryClient();
  const [dataCar, setDataCar] = useState([]);
  const [popupBooking, setPopupBooking] = useState(false)
  const MySwal = withReactContent(Swal)
  const api = process.env.REACT_APP_API_ENDPOINT;
  const history = useNavigate()
  const [carByStatus, setCarByStatus] = useState([])



  const getCar = async () => {
    const {data} = await axios.get(`${api}/cars`)
     return data;
   
  }

  const bookingNow = (namaMobil) => {
    let userid = localStorage.getItem('role') === 'kostumer' && localStorage.getItem('token') !== null ? true : false
    try {
      if(!userid){
        return Swal.fire({
          icon: 'error',
          title: 'You Must Login',
          text: 'Please register for an account and login',
          footer: `<a href="/register">Register Account Click Here</a>`
        })
      }
     history(`/sewa-mobil/${namaMobil}`)

    } catch (error) {
      console.log(error)
    }
  }

  const formatRupiah = (e) => {
    return new Intl.NumberFormat('id-ID',
       { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
     ).format(e);
     
  }

 
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const {data, isLoading, isError} = useQuery('cars', getCar);
  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error Fetching Data..</p>
  return (
    <div>
    <Slider {...settings} className='container-fluid truncate '>
      <div className=''>
        <img src={slide1} alt='' className='w-full'/>
      </div>
      <div className=''>
        <img src={slide2} alt='' className='w-full' />
      </div>
    </Slider>
  

    <div className='container mt-20 mb-20'>
      <h1 className='text-center text-black font-semibold text-5xl font-poppins'>Our Car</h1>
    <div className='grid grid-cols-4 gap-10 mt-10'>
        {Array.isArray(data) && data.map((data, index) => (
          <div key={index} className='bg-blue-100 p-10 drop-shadow mt-10 rounded-md '>
            <img alt='' src={data.image} className='w-full' />
            <h1 className='font-poppins text-xl text-center mt-5 font-semibold'>{data.name_car}</h1>
            <p className='font-poppins text-center'>{formatRupiah(data.harga)} / Day</p>
            <div className='text-center'>
            <button className='bg-yellow-400 font-poppins rounded py-1 px-2 mt-3' onClick={() => bookingNow(data.slug)}>Booking Now!</button>
            </div>
          </div>
        ))}
        </div>
      
    
      
    
    </div>

    <div className='bg-gray-100 py-10'>

    </div>
    
    </div>
  )
}

export default Home