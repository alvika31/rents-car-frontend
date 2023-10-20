import React from 'react'
import { formatRupiah } from '../utils/Setting'
import {
    IconEdit,
    IconTrashX,
    IconFileDescription,
  } from "@tabler/icons-react";

function ItemCar({image, name_car, harga, status, id, promo, onDetail, onEdit, onDelete}) {
  return (
    <div className="flex gap-y-3 flex-col justify-between bg-white drop-shadow-lg border-t-4 border-blue-500 rounded-md p-10">
                <img src={image} alt="" />

                <h1 className="font-semibold font-poppins">{name_car}</h1>
                <h2 className="font-semibold font-poppins text-xl">
                  {formatRupiah(harga)} / Malam
                </h2>
                <h2 className="font-semibold font-poppins text-sm">
                  {status === "0" ? (
                    <>
                      <span className="bg-red-500 text-white rounded-md p-1">
                        Tidak Tersedia
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-green-500 text-white rounded-md p-1">
                        Tersedia
                      </span>
                    </>
                  )}
                </h2>
                <h2 className="font-semibold font-poppins text-sm">
                  {!promo ? 'Tidak Ada Promo' : 'Ada Promo'}
                </h2>
                <div className="flex gap-x-2">
                  <button
                    onClick={() => onDetail(id)}
                    className="bg-white font-poppins inline-flex border border-black text-black py-1 px-2 rounded-md font-semibold"
                  >
                    <IconFileDescription /> Detail
                  </button>
                  <button
                    onClick={() => onEdit(id)}
                    className="bg-white font-poppins inline-flex border border-black text-black py-1 px-2 rounded-md font-semibold"
                  >
                    <IconEdit /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="bg-white font-poppins inline-flex border border-black text-black py-1 px-2 rounded-md font-semibold"
                  >
                    <IconTrashX /> Hapus
                  </button>
                </div>
              </div>
  )
}

export default ItemCar