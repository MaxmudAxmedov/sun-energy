import { useGetData } from "@/hook/useApi";
import React from "react";

export const useInvidivual = ({ limit, searchTerm }) => {
  console.log(limit, searchTerm);
  const { data: clientCustomer } = useGetData({
    endpoint: "/client-customers",
    enabled: true,
    params: { limit, search: searchTerm },
    getQueryKey: "/clients",
  });
  return clientCustomer?.Data?.customers?.map((item) => {
    return {
      ...item,
      type: "customer",
    };
  });
};
