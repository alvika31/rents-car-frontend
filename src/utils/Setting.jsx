import React from "react";
import moment from 'moment'

export const formatRupiah = (e) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(e);
  };

export const formatDate = (dateString) => {
  const formattedDate = moment(dateString).locale('id').format('dddd, D MMMM YYYY');
  return formattedDate;
};