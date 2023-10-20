import React, { useState } from "react";
import axios from "axios";
import {
  IconArmchair,
  IconAppWindowFilled,
  IconAdjustmentsHorizontal,
  IconReceipt2,
  IconFileDescription,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import { formatDate, formatRupiah } from "../utils/Setting";
import {
  useQuery,
  useQueryClient,
} from "react-query";

const api = process.env.REACT_APP_API_ENDPOINT;
function Booking() {
  const queryClient = useQueryClient();
  const [detailSewa, setDetailSewa] = useState([])
  const [show, setShow] = useState(false);

 
  const getSewa = async () => {
    const { data } = await axios.get(`${api}/data-booking`);
    return data.dataBooking;
  };

 
  const { data: bookings, isLoading, isError } = useQuery("bookings", getSewa);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  const getSewaDetail = async (id) => {
    const data = bookings.find((item) => item.id === id);
    setDetailSewa(data);
    setShow(true);
  };
  return (
    <div>
      <div className={show === true ? "hidden" : "block"}>
        <h1 className="duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl">
          Data Booking
        </h1>

        <div className="bg-white drop-shadow-2xl p-10 rounded-md border-t-4 border-blue-500 mt-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  No
                </th>
                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  Nama Pemesan
                </th>
                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  Nama Mobil
                </th>

                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  Lama Sewa
                </th>
                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  Total Harga
                </th>
                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  Status Pembayaran
                </th>
                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  Tanggal Pesan
                </th>
                <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((items, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {items.kostumer.nama_lengkap}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {items?.car?.name_car}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {items.lama_sewa} Hari
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {formatRupiah(items.total_harga)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    <div
                      className={
                        items.status === 1
                          ? "bg-green-500 text-white text-sm rounded p-1 inline-flex"
                          : "bg-red-500 text-white text-sm rounded p-1 inline-flex"
                      }
                    >
                      {items.status === 1 ? "Sudah Bayar" : "Belum Bayar"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {formatDate(items.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    <button
                      onClick={() => getSewaDetail(items.id)}
                      className="border border-gray-200 p-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white ml-2"
                    >
                      <IconInfoCircleFilled />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {detailSewa == 0 ? (
        ""
      ) : (
        <div className={show === false ? "hidden" : "block"}>
          <h1 className="duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl">
            Detail Pesanan
          </h1>
          <div className="flex gap-x-10 items-center bg-white drop-shadow-2xl p-10 rounded-md border-t-4 border-blue-500 mt-10">
            <div className="w-1/2">
              <img alt="" src={detailSewa.car.image} />
            </div>
            <div className="w-1/2 flex flex-col gap-y-3">
              <h1 className="text-4xl font-bold font-poppins mb-3">
                {detailSewa.car.name_car}
              </h1>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconAppWindowFilled className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold  font-poppins">
                  Plat Kendaraan: {detailSewa.car.plat}
                </h1>
              </div>

              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconArmchair className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold  font-poppins">
                  Seat: {detailSewa.car.seat} Seat
                </h1>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconAdjustmentsHorizontal className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold  font-poppins">
                  Tipe Mobil: {detailSewa.car.tipe_mobil}
                </h1>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconReceipt2 className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold  font-poppins">
                  Harga: {formatRupiah(detailSewa.car.harga)} / Hari
                </h1>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconFileDescription className="text-blue-500" />
                </div>

                <p
                  dangerouslySetInnerHTML={{ __html: detailSewa.car.deskripsi }}
                  className="text-md font-poppins"
                ></p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconInfoCircleFilled className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold font-poppins">
                  Status:
                  {detailSewa.status === 0 ? (
                    <span className="text-red-500 ml-2">Belum Dibayar</span>
                  ) : (
                    <span className="text-green-500 ml-2">Sudah Dibayar</span>
                  )}
                </h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="bg-white drop-shadow-2xl p-10 rounded-md border-t-4 border-blue-500 mt-10">
              <h1 className="text-4xl font-bold font-poppins mb-3">
                Informasi Kostumer
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Nama Lengkap: {detailSewa.kostumer.nama_lengkap}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Email: {detailSewa.kostumer.email}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Alamat: {detailSewa.kostumer.alamat}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Whatsapp: {detailSewa.kostumer.whatsapp}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                KTP: {detailSewa.kostumer.ktp}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Jenis Kelamin: {detailSewa.kostumer.jenis_kelamin}
              </h1>
            </div>
            <div className="bg-white drop-shadow-2xl p-10 rounded-md border-t-4 border-blue-500 mt-10">
              <h1 className="text-4xl font-bold font-poppins mb-3">
                Informasi Pesanan
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Mulai Sewa: {formatDate(detailSewa.awal_sewa)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Akhir Sewa: {formatDate(detailSewa.akhir_sewa)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Tanggal Pengembalian:{" "}
                {formatDate(detailSewa.tanggal_pengambalian)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Lama Sewa: {detailSewa.lama_sewa} Hari
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Total Harga: {formatRupiah(detailSewa.total_harga)}
              </h1>
              <div className="flex gap-x-3">
                {detailSewa.status === 0 ? (
                  <button className="bg-green-500 font-poppins text-white rounded-md py-1 px-2 mt-5">
                    Kirim Notifikasi
                  </button>
                ) : (
                  <button className="bg-green-500 font-poppins text-white rounded-md py-1 px-2 mt-5">
                    Kirim Supir
                  </button>
                )}
                <button
                  onClick={() => setShow(false)}
                  className="bg-red-500 font-poppins text-white rounded-md py-1 px-2 mt-5"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
