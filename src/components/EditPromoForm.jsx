import React from 'react'
import { formatRupiah } from '../utils/Setting'

function EditPromoForm({
    hargaPromo,
    handleHargaPromo,
    tanggalPromo,
    setTanggalPromo,
    tanggalAkhirPromo,
    setTanggalAkhirPromo,
    errorPromo,
}) {
  return (
    <div>
        <div className="flex flex-col">
        <h1 className="font-semibold text-xl text-slate-900">Tambah Promo</h1>
        <div className="">
          <label className="text-slate-600 text-base">Harga Promo:</label>
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
          {errorPromo === true ? (
            <p className="text-red-500">
              Harga Promo Lebih Besar Dari Harga Asli
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="">
          <label className="text-slate-600 text-base">Tanggal Promo:</label>
          <div className="flex gap-1 w-full relative py-1 px-3 ring-1 ring-gray-300 rounded-md">
            <input
              type="date"
              value={tanggalPromo}
              onChange={(e) => setTanggalPromo(e.target.value)}
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
      </div>
    </div>
  )
}

export default EditPromoForm