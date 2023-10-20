import React, {  useState, Fragment } from 'react'
import axios from 'axios';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
function Home() {
    const queryClient = useQueryClient();
    const [username, setUsername] = useState('')
    const api = process.env.REACT_APP_API_ENDPOINT;

    // useEffect(() => {
    //     getMyName()
    // }, [])

    const getMyName = async () => {
      
            const token = localStorage.getItem('token');
            const {data} = await axios.get(`${api}/kostumername`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return data
    }

const {data, isLoading, isError} = useQuery('profiles', getMyName);
  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error Fetching Data..</p>
  return (
    <div>
        <h1 className='font-poppins text-black font-semibold text-2xl'>Hallo {data.nama_lengkap}, Welcome Back!</h1>
    </div>
  )
}

export default Home