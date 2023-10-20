import React, {  useState, Fragment } from "react";
import { IconFileDescription, IconAlertTriangle } from "@tabler/icons-react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Editor } from "react-draft-wysiwyg";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useMutation
} from "react-query";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CardListCar from "../components/CardListCar";
import { formatRupiah, formatDate } from "../utils/Setting";
import PopupFormCar from "../components/PopupFormCar";
import EditPromoForm from "../components/EditPromoForm";


const api = process.env.REACT_APP_API_ENDPOINT;
export default function Car() {
  const queryClient = useQueryClient();
  const [dataCar, setDataCar] = useState([]);
  const [dataPromo, setDataPromo] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [uploadImage, setUploadImage] = useState("");
  const [nameCar, setNameCar] = useState("");
  const [plat, setPlat] = useState("");
  const [seat, setSeat] = useState();
  const [tipeMobil, setTipeMobil] = useState("");
  const [harga, setHarga] = useState("");
  const [status, setStatus] = useState("");
  const [deskripsi, setDeskripsi] = useState(() => EditorState.createEmpty());
  const [deskripsiCon, setDeskripsiCon] = useState("");
  const [id, setId] = useState("");
  const [errorForm, setErrorForm] = useState({});
  const [openPromo, setOpenPromo] = useState(false);
  const MySwal = withReactContent(Swal);
  const [dataPromoCar, setDataPromoCar] = useState({});
  const [hargaPromo, setHargaPromo] = useState("");
  const [tanggalPromo, setTanggalPromo] = useState("");
  const [tanggalAkhirPromo, setTanggalAkhirPromo] = useState("");
  const [errorPromo, setErrorPromo] = useState(false);
  const [loading, setLoading] = useState(false)


  const getAllCar = async () => {
   
    const {data} = await axios.get(`${api}/cars/`);
     return data

  };



  const handleFileChange = (event) => {
    setUploadImage(event.target.files[0]);
    setStatus(1);
  };

  const addCarMutation = useMutation(
    async (formData) => {
      await axios.post(`${api}/cars/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: (data) => {
        MySwal.fire({
          title: <strong>success!</strong>,
          html: <i>Data Berhasil Dimasukan</i>,
          icon: 'success',
        });
        queryClient.invalidateQueries('cars');
        setModalInsert(false);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleAddCar = async (
    uploadImage,
    nameCar,
    plat,
    seat,
    tipeMobil,
    harga,
    status,
    deskripsi,
    hargaPromo,
    tanggalPromo,
    tanggalAkhirPromo
  ) => {
    const contentState = deskripsi.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const markup = draftToHtml(rawContentState);
    const formData = new FormData();
    formData.append("image", uploadImage);
    formData.append("name_car", nameCar);
    formData.append("plat", plat);
    formData.append("seat", seat);
    formData.append("tipe_mobil", tipeMobil);
    formData.append("harga", harga);
    formData.append("status", status);
    formData.append("deskripsi", markup);
    formData.append("harga_promo", hargaPromo);
    formData.append("tanggal_mulai", tanggalPromo);
    formData.append("tanggal_akhir", tanggalAkhirPromo);
    const carEmpty = {};
    if (uploadImage === "") {
      carEmpty.uploadImage = "Gambar Required";
    }
    if (nameCar === "") {
      carEmpty.nameCar = "Nama Mobil Required";
    }
    if (plat === "") {
      carEmpty.plat = "Plat Required";
    }
    if (seat === "") {
      carEmpty.seat = "Seat Required";
    }
    if (tipeMobil === "") {
      carEmpty.tipeMobil = "Tipe Mobil Required";
    }
    if (harga === "") {
      carEmpty.harga = "Harga Required";
    }
    if (status === "") {
      carEmpty.status = "Status Required";
    }
    if (markup === "") {
      carEmpty.uploadImage = "Deskripsi Required";
    }
    setErrorForm(carEmpty);
    addCarMutation.mutate(formData);

  
  };

  const showModalInsert = () => {
    setModalInsert(true);
    setUploadImage("");
    setNameCar("");
    setPlat("");
    setSeat();
    setTipeMobil("");
    setHarga("");
    setStatus();
    setDeskripsi("");
  };

  const handleDetailCar = (id) => {
    setHargaPromo('')
    setTanggalAkhirPromo('')
    setTanggalPromo('')
    const itemCarDetail = cars.find((item) => item.id === id);
    setModalDetail(true);
    setUploadImage(itemCarDetail.image);
    setNameCar(itemCarDetail.name_car);
    setPlat(itemCarDetail.plat);
    setSeat(itemCarDetail.seat);
    setTipeMobil(itemCarDetail.tipe_mobil);
    setHarga(itemCarDetail.harga);
    setStatus(itemCarDetail.status);

    setDeskripsiCon(itemCarDetail.deskripsi);
    if(itemCarDetail.promo){
      setHargaPromo(itemCarDetail.promo.harga_promo);
      setTanggalPromo(itemCarDetail.promo.tanggal_mulai);
      setTanggalAkhirPromo(itemCarDetail.promo.tanggal_akhir)
    }
    setDataPromoCar(itemCarDetail.promo);
  };

  const deteleMutationCar = useMutation((id) => axios.delete(`${api}/cars/${id}`), {
    onSuccess: () => {
      MySwal.fire('Deleted!', 'Car Has Been Deleted.', 'success');
        queryClient.invalidateQueries('cars');
    },
    onError: (error) => {
      console.log(error.message)
    }
  })
  const handleDeleteCar = (id) => {
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
        if (result.isConfirmed) {
          // axios.delete(`${api}/cars/${id}`);
          deteleMutationCar.mutate(id);
        }
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  const showModalEdit = async (id) => {
    setUploadImage("");
    setNameCar("");
    setPlat("");
    setHarga("");
    setStatus();
    setDeskripsi("");
    setHargaPromo('')
    setTanggalAkhirPromo('')
    setTanggalPromo('')
    setModalEdit(true);
    setOpenPromo(false)
    const itemCarDetail = cars.find((item) => item.id === id);
    
    const _contentState = convertFromHTML(itemCarDetail.deskripsi);
    const raw = ContentState.createFromBlockArray(
      _contentState.contentBlocks,
      _contentState.entityMap
    );
    setDeskripsi(EditorState.createWithContent(raw));

    if(itemCarDetail.promo){
      setHargaPromo(itemCarDetail.promo.harga_promo);
      setTanggalPromo(itemCarDetail.promo.tanggal_mulai);
      setTanggalAkhirPromo(itemCarDetail.promo.tanggal_akhir)
    }
    setDataPromoCar(itemCarDetail.promo);
    
    setUploadImage(itemCarDetail.image);
    setNameCar(itemCarDetail.name_car);
    setPlat(itemCarDetail.plat);
    setSeat(itemCarDetail.seat);
    setTipeMobil(itemCarDetail.tipe_mobil);
    setHarga(itemCarDetail.harga);
    setStatus(itemCarDetail.status);
    setId(itemCarDetail.id);
  };

  const handleEditorChange = (editorState) => {
    setDeskripsi(editorState);
  };

  const doUpdateCar = async (e) => {
    e.preventDefault();
    const contentState = deskripsi.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const markup = draftToHtml(rawContentState);
    const formData = new FormData();
    formData.append("image", uploadImage);
    formData.append("name_car", nameCar);
    formData.append("plat", plat);
    formData.append("seat", seat);
    formData.append("tipe_mobil", tipeMobil);
    formData.append("harga", harga);
    formData.append("status", status);
    formData.append("deskripsi", markup);
    formData.append("harga_promo", hargaPromo);
    formData.append("tanggal_mulai", tanggalPromo);
    formData.append("tanggal_akhir", tanggalAkhirPromo);

    try {
      const response = await axios.put(`${api}/cars/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      
      });
      queryClient.invalidateQueries('cars');

      const updatedDataCar = dataCar.map((item) =>
        item.id === id ? response.data : item
      );
      setDataCar(updatedDataCar);
 
      MySwal.fire({
        title: <strong>Success!</strong>,
        html: <i>Data Car Berhasil Diedit</i>,
        icon: "success",
      }).then(() => {
        setModalEdit(false); // Menutup modal setelah notifikasi ditutup.
      });
      
      // MySwal.fire({
      //   title: <strong>success!</strong>,
      //   html: <i>Data Car Berhasil Diedit</i>,
      //   icon: "success",
      // });
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleHargaPromo = (e) => {
    const inputHargaPromo = e.target.value;
    setHargaPromo(inputHargaPromo);
    const changeHargaPromo = Number(inputHargaPromo);
    const changeHargaAsli = Number(harga);

    if (!harga) {
      setHargaPromo("");
      return alert("Masukan Harga Terlebih Dahulu");
    }

    if (changeHargaPromo >= changeHargaAsli) {
      setErrorPromo(true);
    } else {
      setErrorPromo(false);
    }
  };
  const { data: cars, isLoading, isError } = useQuery("cars", getAllCar);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;


  return (
    <div>
      <h1 className="duration-500 transition-opacity delay-1000 font-poppins text-black font-extrabold text-4xl">
        Data Car
      </h1>

      <div className="drop-shadow-2xl p-10 bg-white mt-10">
        <button
          onClick={showModalInsert}
          className="bg-green-500 text-white px-4 py-3 font-poppins inline-flex rounded-md mb-10"
        >
          <IconFileDescription /> Tambah Armada Mobil
        </button>
        <CardListCar
          cars={cars}
          onDetail={handleDetailCar}
          onDelete={handleDeleteCar}
          onEdit={showModalEdit}
        />
      </div>


      {!cars && (
        <div className="p-6 bg-red-500 text-white font-bold text-xl rounded-md drop-shadow-md flex gap-4 items-center">
          <IconAlertTriangle /> <h1>Data Mobil belum tersedia</h1>
        </div>
      )}

      <PopupFormCar
        addCar={handleAddCar}
        errorForm={errorForm}
        modal={modalInsert}
        setModal={setModalInsert}
      />
      <Transition appear show={modalDetail} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setModalDetail(false)}
        >
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
                <Dialog.Panel className="w-4/5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 mb-10"
                  >
                    Detail Mobil
                  </Dialog.Title>
                  <div className="flex items-center">
                    <div className="w-1/2">
                      <img src={uploadImage} alt="" />
                    </div>
                    <div className="w-1/2 bg-gray-200 flex flex-col gap-y-1 items-start rounded-md p-5">
                      <h1 className="text-2xl text-slate-500 font-bold">
                        {" "}
                        {nameCar}
                      </h1>
                      <h2 className="text-slate-500 mt-2">
                        Harga: {formatRupiah(harga)}
                      </h2>
                      <h2 className="text-slate-500 mt-1">Plat: {plat}</h2>

                      <h2 className="text-slate-500 mt-1">Seat: {seat}</h2>
                      <h2 className="text-slate-500 mt-1">
                        Transmisi: {tipeMobil}
                      </h2>

                      <h2 className="text-slate-500 font-semibold mt-1 inline-flex gap-2 items-center">
                        Status:{" "}
                        <div
                          className={
                            status === "1"
                              ? "bg-green-500 text-white text-sm px-1 rounded"
                              : "bg-red-500 text-white text-sm px-1 rounded"
                          }
                        >
                          {status === "1"
                            ? "Mobil Tersedia"
                            : "Mobil Tidak Tersedia"}
                        </div>
                      </h2>
                      <h2 className="text-slate-500 text-base font-semibold mt-1">
                        Deskripsi:
                      </h2>
                      {status === 1 && (
                        <div className="p-6 bg-red-500 text-white font-bold text-xl rounded-md drop-shadow-md flex gap-4 items-center">
                          <IconAlertTriangle />{" "}
                          <h1>Data Mobil belum tersedia</h1>
                        </div>
                      )}
                      <p dangerouslySetInnerHTML={{ __html: deskripsiCon }}></p>
                     
                      {dataPromoCar && (
                        <div>
                        <h1 className="font-semibold text-xl">Data Promo</h1>
                          <p className="text-slate-600 text-sm">
                            Harga Promo: Rp. {dataPromoCar.harga_promo}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Awal Promo: {formatDate(dataPromoCar.tanggal_mulai)}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Akhir Promo:{" "}
                            {formatDate(dataPromoCar.tanggal_akhir)}
                          </p>
                          </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={modalEdit} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setModalEdit(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed  inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-4/5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Edit Mobil
                  </Dialog.Title>
                  <form onSubmit={doUpdateCar}>
                    <div className="flex items-start gap-x-5">
                      <div className="w-3/4">
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div className="">
                            <label className="text-slate-600 text-base">
                              Gambar Mobil:
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="w-full py-1 px-3 ring-1 ring-gray-300 rounded-md"
                            />
                            <img
                              src={uploadImage}
                              width={150}
                              height={150}
                              alt=""
                            />
                            <input
                              type="hidden"
                              value={id}
                              onChange={(e) => setId(id)}
                            />
                          </div>
                          <div className="">
                            <label className="text-slate-600 text-base">
                              Nama Mobil:
                            </label>
                            <input
                              type="text"
                              value={nameCar}
                              onChange={(e) => setNameCar(e.target.value)}
                              className="w-full py-1 px-3 ring-1 ring-gray-300 rounded-md"
                            />
                          </div>
                          <div className="">
                            <label className="text-slate-600 text-base">
                              Plat Nomor:
                            </label>
                            <input
                              type="text"
                              value={plat}
                              onChange={(e) => setPlat(e.target.value)}
                              className="w-full py-1 px-3 ring-1 ring-gray-300 rounded-md"
                            />
                          </div>
                          <div className="">
                            <label className="text-slate-600 text-base">
                              Seat:
                            </label>
                            <input
                              type="number"
                              value={seat}
                              onChange={(e) => setSeat(e.target.value)}
                              className="w-full py-1 px-3 ring-1 ring-gray-300 rounded-md"
                            />
                          </div>
                          <div className="">
                            <label className="text-slate-600 text-base">
                              Tipe Mobil:
                            </label>
                            <select
                              value={tipeMobil}
                              onChange={(e) => setTipeMobil(e.target.value)}
                              className="w-full py-1 px-3 ring-1 ring-gray-300 rounded-md"
                            >
                              <option value="">
                                ========Pilih Mobil==========
                              </option>
                              <option value="Automatic">Automatic</option>
                              <option value="Manual">Manual</option>
                            </select>
                          </div>
                          <div className="">
                            <label className="text-slate-600 text-base">
                              Harga:
                            </label>
                            <div className="flex gap-1 w-full relative py-1 px-3 ring-1 ring-gray-300 rounded-md">
                              <input
                                type="text"
                                value={harga}
                                onChange={(e) => setHarga(e.target.value)}
                                id="password"
                                className="w-full focus:outline-none focus:ring-white"
                              />
                            </div>
                            <label className="text-slate-600 text-base">
                              Formate Indo: {formatRupiah(harga)}{" "}
                            </label>
                          </div>
                        </div>
                        <Editor
                          editorState={deskripsi}
                          onEditorStateChange={handleEditorChange}
                          wrapperClassName="wrapper-class"
                          editorClassName="editor-class"
                          toolbarClassName="toolbar-class"
                        />
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white"
                          >
                            Edit Car
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalEdit(false)}
                            className="ml-2 border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      {!dataPromoCar ? (
                        
                          <EditPromoForm
                           hargaPromo={hargaPromo}
                          handleHargaPromo={handleHargaPromo}
                          tanggalPromo={tanggalPromo}
                          setTanggalPromo={setTanggalPromo}
                          tanggalAkhirPromo={tanggalAkhirPromo}
                          setTanggalAkhirPromo={setTanggalAkhirPromo}
                          errorPromo={errorPromo} />
                        
                      ) : (
                        <div className="flex flex-col">
                        <div className="w-full bg-gray-200 flex flex-col gap-y-3 items-start rounded-md p-5">
                          <h1 className="font-semibold text-xl">Data Promo</h1>
                          <p className="text-slate-600 text-sm">
                            Harga Promo: Rp. {dataPromoCar.harga_promo}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Awal Promo: {formatDate(dataPromoCar.tanggal_mulai)}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Akhir Promo:{" "}
                            {formatDate(dataPromoCar.tanggal_akhir)}
                          </p>
                          <button
                            type="button"
                            onClick={() => setOpenPromo(!openPromo)}
                            className="px-3 py-1 bg-yellow-500 text-white font-semobold rounded text-sm"
                          >
                            Edit
                          </button>
                        
                        </div>
                        {openPromo === true && (
                            <EditPromoForm
                           hargaPromo={hargaPromo}
                          handleHargaPromo={handleHargaPromo}
                          tanggalPromo={tanggalPromo}
                          setTanggalPromo={setTanggalPromo}
                          tanggalAkhirPromo={tanggalAkhirPromo}
                          setTanggalAkhirPromo={setTanggalAkhirPromo}
                          errorPromo={errorPromo} />
                          )}
                        </div>
                      )}

                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
