import { useGetData } from "@/hook/useApi";

export const useBusinessFetch = ({ limit, searchTerm }) => {
  const { data: clientBusiness } = useGetData({
    endpoint: "/client-businesses",
    enabled: true,
    params: { limit, search: searchTerm },
    getQueryKey: "/clients",
  });

  return clientBusiness?.Data?.businesses?.map((item) => {
    return {
      ...item,
      type: "business",
    };
  });
};
