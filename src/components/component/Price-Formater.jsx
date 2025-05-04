import React from "react";

export const PriceFormater = ({ price }) => {
  const formattedPrice = new Intl.NumberFormat("uz-UZ").format(price);
  return <div>{formattedPrice}</div>;
};
