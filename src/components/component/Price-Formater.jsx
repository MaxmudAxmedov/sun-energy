import React from "react";

export const PriceFormater = ({ price }) => {
  console.log(price);
  const formattedPrice = new Intl.NumberFormat("uz-UZ").format(price);
  console.log(formattedPrice);
  return <div>{formattedPrice}</div>;
};
