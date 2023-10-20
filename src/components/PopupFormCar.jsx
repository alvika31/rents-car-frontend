import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { formatRupiah } from "../utils/Setting";
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';


function PopupFormCar({ addCar, addPromo, errorForm, modal, setModal }) {
  const [uploadImage, setUploadImage] = useState("");
  const [nameCar, setNameCar] = useState("");
  const [plat, setPlat] = useState("");
  const [seat, setSeat] = useState();
  const [tipeMobil, setTipeMobil] = useState("");
  const [harga, setHarga] = useState("");
  const [status, setStatus] = useState("");
  const [deskripsi, setDeskripsi] = useState(() => EditorState.createEmpty());
  const [showPromo, setShowPromo] = useState(false)
  const [hargaPromo, setHargaPromo] = useState('');
  const [tanggalPromo, settanggalPromo] = useState('')
  const [tanggalAkhirPromo, setTanggalAkhirPromo] = useState('')
  const [errorPromo, setErrorPromo] = useState(false)

  const handleFileChange = (event) => {
    setUploadImage(event.target.files[0]);
    setStatus(1);
  };

  const insertPromo = (e) => {
    e.preventDefault()
    addPromo(hargaPromo,
      tanggalPromo,
      tanggalAkhirPromo)
    setHargaPromo('')
    settanggalPromo('')
    setTanggalAkhirPromo('')
  }

  const insertCar = (e) => {
    e.preventDefault();
    addCar(
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
      tanggalAkhirPromo,
      hargaPromo,
      tanggalPromo,
      tanggalAkhirPromo
    );
    setUploadImage("");
    setNameCar("");
    setSeat("");
    setPlat("");
    setHarga("");
    setStatus();
    setDeskripsi("");
    setHargaPromo('')
    settanggalPromo('')
    setTanggalAkhirPromo('') 
  };

  const handleHargaPromo = (e) => {
    const inputHargaPromo = e.target.value;
    setHargaPromo(inputHargaPromo);
    const changeHargaPromo = Number(inputHargaPromo);
    const changeHargaAsli = Number(harga);

    if(!harga){
      setHargaPromo('')
      return alert('Masukan Harga Terlebih Dahulu')
    }

    if (changeHargaPromo >= changeHargaAsli) {
      setErrorPromo(true);
    } else {
      setErrorPromo(false);
    }
  }

  const handleFormPromo = () => {
    setShowPromo(!showPromo)
    setHargaPromo('')
    settanggalPromo('')
    setTanggalAkhirPromo('')
  }
  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setModal(false)}
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
                  className="text-xl font-medium leading-6 text-gray-900"
                >
                  Tambah Mobil
                </Dialog.Title>
                <div className="flex gap-x-10">
                  <form onSubmit={insertCar} className="flex gap-x-10">
                  <div className="flex flex-col">
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
                        {errorForm.uploadImage && (
                          <span className="text-red-500 text-sm">
                            {errorForm.uploadImage}
                          </span>
                        )}
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
                        {errorForm.nameCar && (
                          <span className="text-red-500 text-sm">
                            {errorForm.nameCar}
                          </span>
                        )}
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
                        {errorForm.plat && (
                          <span className="text-red-500 text-sm">
                            {errorForm.plat}
                          </span>
                        )}
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
                        {errorForm.seat && (
                          <span className="text-red-500 text-sm">
                            {errorForm.seat}
                          </span>
                        )}
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
                        {errorForm.tipeMobil && (
                          <span className="text-red-500 text-sm">
                            {errorForm.tipeMobil}
                          </span>
                        )}
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
                        {errorForm.harga && (
                          <span className="text-red-500 text-sm">
                            {errorForm.harga}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                    <Editor
                      wrapperClassName="demo-wrapper mt-5"
                      editorClassName="demo-editor"
                      editorState={deskripsi}
                      onEditorStateChange={setDeskripsi}
                    />
                    {errorForm.deskripsi && (
                      <span className="text-red-500 text-sm">
                        {errorForm.deskripsi}
                      </span>
                    )}
</div>
                    <div className="mt-10">
                      <button
                        type="submit"
                        className="border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-green-500 hover:text-white"
                      >
                        Save Car
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal(false)}
                        className="ml-2 border border-gray-200 px-2 py-1 rounded-md transition ease-in-out delay-100 hover:bg-red-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                    </div>
                  <div className="w-2/6">
                    <button
                    onClick={handleFormPromo}
                      type="button"
                      className="inline-flex gap-x-3 justify-center bg-gray-300 w-full text-slate-700 px-3 py-2 rounded font-bold mb-5"
                    > 
                    {showPromo === true ? <IconCaretUp/>  : <IconCaretDown />}
                    
                      Tambah Promo
                    </button>
                    {showPromo === true && (
                      <>
                      <div className="">
                        <label className="text-slate-600 text-base">
                          Harga Promo:
                        </label>
                        <div className="flex gap-1 w-full relative py-1 px-3 ring-1 ring-gray-300 rounded-md">
                          <input
                            type="text"
                            value={hargaPromo}
                            onChange={handleHargaPromo}
                            id="password"
                            className="w-full focus:outline-none focus:ring-white"
                          />
                        </div>

                        <label className="text-slate-600 text-base">
                          Formate Indo: {formatRupiah(hargaPromo)}{" "}
                        </label>
                        {errorPromo === true ? <p className="text-red-500">Harga Promo Lebih Besar Dari Harga Asli</p> : ''}
                      </div>
                      <div className="">
                        <label className="text-slate-600 text-base">
                          Tanggal Promo:
                        </label>
                        <div className="flex gap-1 w-full relative py-1 px-3 ring-1 ring-gray-300 rounded-md">
                          <input
                            type="date"
                            value={tanggalPromo}
                            onChange={(e) => settanggalPromo(e.target.value)}
                            className="w-full focus:outline-none focus:ring-white"
                          />
                        </div>
                      </div>
                      <div className="">
                        <label className="text-slate-600 text-base">
                          Tanggal Akhir Promo:
                        </label>
                        <div className="flex gap-1 w-full relative py-1 px-3 ring-1 ring-gray-300 rounded-md">
                          <input
                            type="date"
                            className="w-full focus:outline-none focus:ring-white"
                            value={tanggalAkhirPromo}
                            onChange={(e) => setTanggalAkhirPromo(e.target.value)}
                          />
                        </div>
                      </div>
                     
                      </>
                    )}
                   
                  </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default PopupFormCar;
