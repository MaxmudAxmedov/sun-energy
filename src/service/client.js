import apiClient from "@/config/apiClient";

export const getClientById = (id) => {
    return apiClient({ method: "get", url: `/client-customer/${id}` });
};
