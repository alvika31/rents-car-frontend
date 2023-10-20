import React from 'react'
import ItemCar from './ItemCar'

function CardListCar({cars, onDetail, onEdit, onDelete}) {
  return (
    <div className="grid grid-cols-4 gap-5">
        {cars.map((car, index) => 
            <ItemCar key={index} image={car.image} promo={car.promo} name_car={car.name_car} harga={car.harga} status={car.status} id={car.id} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete}/>
        )}
    </div>
  )
}

export default CardListCar