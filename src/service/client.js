import apiClient from "@/config/apiClient";

export const getClientById = (id) => {
    return apiClient({ method: "get", url: `/client-customer/${id}` });
};
export const getBusinessClientById = (id) => {
    return apiClient({ method: "get", url: `/client-business/${id}` });
};

export const getClientsBusiness = (params) => {
    return apiClient({ method: "get", url: `/client-businesses`, params });
};

export const getClientsCustomers = (params) => {
    return apiClient({ method: "get", url: `/client-customers`, params });
};
