import React, {useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate, NavLink, useParams } from "react-router-dom";
import {
  IconArmchair,
  IconAppWindowFilled,
  IconAdjustmentsHorizontal,
  IconReceipt2,
  IconFileDescription,
  IconSquareRoundedCheckFilled,
} from "@tabler/icons-react";
import moment from "moment";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
require("moment/locale/id");

function PesananKostumer() {
  const queryClient = useQueryClient();
  const [dataSewa, setDataSewa] = useState([]);
  const [detailSewa, setDetailSewa] = useState([]);
  const [dataProfile, setDataProfile] = useState([]);
  const [id, setId] = useState("");
  const [show, setShow] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const api = process.env.REACT_APP_API_ENDPOINT;
  const history = useNavigate();

  useEffect(() => {
    getProfile();
    getPesanan();
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "SB-Mid-client-a3M-SkOHovJuu1mE"; //change this according to your client-key

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", myMidtransClientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/kostumername`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataProfile(response.data);
      setId(response.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  const getPesanan = async () => {
    try {
      const response = await axios.get(`${api}/data-sewa/${id}`);
      setDataSewa(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const detailSewaId = (id) => {
    const dataDetail = dataSewa.find((item) => item.id === id);
    setDetailSewa(dataDetail);
    setShow(true);
    setShowInvoice(false);
  };

  const invoiceSewaId = (id) => {
    const dataDetail = dataSewa.find((item) => item.id === id);
    setDetailSewa(dataDetail);
    setShow(false);
    setShowInvoice(true);
  };

  const updateStatusSewa = async () => {
    try {
      const response = await axios.put(
        `${api}/status-sewa/${detailSewa.id_car}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const formatRupiah = (e) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(e);
  };

  const formatDate = (dateString) => {
    const formattedDate = moment(dateString)
      .locale("id")
      .format("dddd, D MMMM YYYY");
    return formattedDate;
  };

  function generateUniqueId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const id = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return id;
  }

  const handlePayment = async () => {
    try {
      // Kirim permintaan ke server untuk membuat order
      const orderResponse = await axios.post(`${api}/create-payment`, {
        amount: detailSewa.total_harga,
        orderId: generateUniqueId(), // Total pembayaran
        itemDetails: {
          id: detailSewa.id,
          price: detailSewa.total_harga,
          name: detailSewa.car.name_car,
          quantity: 1,
        },
        costumerDetails: {
          first_name: dataProfile.nama_lengkap,
          email: dataProfile.email,
          phone: dataProfile.whatsapp,
        },
      });
      const { token } = orderResponse.data.snapToken;
      console.log(token);

      // Panggil Snap API untuk membuka pop-up pembayaran

      window.snap.pay(token, {
        onSuccess: function (result) {
          updateStatusSewa();
          alert("Payment success");
          updateStatusSewa();
          console.log("Payment success", result);
        },
        onPending: function (result) {
          alert("Payment pending");
          console.log("Payment pending", result);
          // Lakukan tindakan lanjutan yang diperlukan setelah pembayaran tertunda
        },
        onError: function (result) {
          alert("Payment error");
          console.error("Payment error", result);
          // Lakukan tindakan lanjutan yang diperlukan jika terjadi kesalahan pembayaran
        },
      });
      console.log(orderResponse);
    } catch (error) {
      console.error("Error creating order", error);
    }
  };


  return (
    <div>
      <h1 className="duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl">
       Your Order
      </h1>
      <div
        className={
          show === true || showInvoice === true
            ? "hidden"
            : "block duration-500 transition-opacity ease-in-out delay-1000 bg-white drop-shadow-2xl p-10 rounded-md mt-10"
        }
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
                No
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
                Name Car
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
              Length of Rental
              </th>

              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
                Total Price
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
              Booking Date
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
                Status
              </th>
              <th className="px-6 py-3 text-md font-bold text-left uppercase font-poppins ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {dataSewa &&
              dataSewa.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {item?.car?.name_car}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {item.lama_sewa} Days{" "}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {formatRupiah(item.total_harga)}{" "}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {formatDate(item.createdAt)}{" "}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {item.status === 0 ? (
                      <div className="p-1 bg-red-500 text-white inline-flex rounded-lg text-xs">
                      Unpaid
                      </div>
                    ) : (
                      <div className="p-1 bg-green-500 text-white inline-flex rounded-lg text-xs">
                        Paid
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-poppins">
                    {item.status === 0 ? (
                      <button
                        onClick={() => detailSewaId(item.id)}
                        className="px-3 py-3 font-semibold bg-blue-500 text-white rounded-full"
                      >
                        Pay Order
                      </button>
                    ) : (
                      <button
                        onClick={() => invoiceSewaId(item.id)}
                        className="px-3 py-3 font-semibold bg-yellow-500 text-black rounded-full"
                      >
                        View Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {detailSewa == 0 ? (
        ""
      ) : (
        <div
          className={
            show === false
              ? "hidden"
              : "block animate-slide-in-bottom duration-500 transition-opacity delay-1000 bg-white drop-shadow-2xl p-10 rounded-md mt-10"
          }
        >
          <div className="flex items-center gap-x-4">
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
                Vehicle License Plate: {detailSewa.car.plat}
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
                Car Type: {detailSewa.car.tipe_mobil}
                </h1>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconReceipt2 className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold  font-poppins">
                  Price: {formatRupiah(detailSewa.car.harga)} / Hari
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
              <h1 className="text-4xl font-bold font-poppins mb-3 mt-10">
              Rental Details
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
              Lease Start Date: {formatDate(detailSewa.awal_sewa)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
              Lease Expiration Date: {formatDate(detailSewa.akhir_sewa)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
              Return Date:{" "}
                {formatDate(detailSewa.tanggal_pengembalian)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
              Total Days: {detailSewa.lama_sewa} Hari
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Total Price: {formatRupiah(detailSewa.total_harga)}
              </h1>
              <div className="inline-flex gap-x-2">
                <button
                  onClick={handlePayment}
                  className="bg-green-500 font-poppins text-white rounded-md py-1 px-2 mt-5"
                >
                  Pay Now
                </button>
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
      {detailSewa == 0 ? (
        ""
      ) : (
        <div
          className={
            showInvoice === false
              ? "hidden"
              : "block animate-slide-in-bottom duration-500 transition-opacity delay-1000 mt-10"
          }
        >
          <div className="flex gap-x-10 items-center">
            <div className="w-1/3 flex flex-col gap-y-3 bg-white drop-shadow-lg p-10 text-center rounded-md">
              <div className="text-center">
                <IconSquareRoundedCheckFilled className="mx-auto text-green-500 w-20 h-20" />
              </div>
              <h1 className="text-4xl font-bold font-poppins mb-3">
              Your invoice
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
              Lease Start Date: {formatDate(detailSewa.awal_sewa)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
              Lease Expiration Date: {formatDate(detailSewa.akhir_sewa)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
              Return Date:{" "}
                {formatDate(detailSewa.tanggal_pengembalian)}
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Total Days: {detailSewa.lama_sewa} Hari
              </h1>
              <h1 className="text-md font-semibold  font-poppins">
                Total Price: {formatRupiah(detailSewa.total_harga)}
              </h1>
              <h1 className="text-md font-semibold mt-20 font-poppins">
              Thank you for ordering :). We will contact you for the delivery of the car, if 1 x 24 hours there is no contact please contact our admin below
              </h1>
              <button
                onClick={handlePayment}
                className="bg-green-500 font-poppins text-white rounded-md py-1 px-2 mt-5"
              >
                Chat Admin
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="bg-red-500 font-poppins text-white rounded-md py-1 px-2 "
              >
                Back
              </button>
            </div>
            <div className="w-1/3">
              <img alt="" src={detailSewa.car.image} />
            </div>
            <div className="w-1/3 flex flex-col gap-y-3 bg-white drop-shadow-lg p-10 rounded-md">
              <h1 className="text-4xl font-bold font-poppins mb-3">
                {detailSewa.car.name_car}
              </h1>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconAppWindowFilled className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold  font-poppins">
                Vehicle License Plate:{detailSewa.car.plat}
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
                 Car Type: {detailSewa.car.tipe_mobil}
                </h1>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="bg-gray-200 p-1 rounded">
                  <IconReceipt2 className="text-blue-500" />
                </div>
                <h1 className="text-md font-semibold  font-poppins">
                  Price: {formatRupiah(detailSewa.car.harga)} / Hari
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PesananKostumer;
