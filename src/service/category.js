import apiClient from "@/config/apiClient";

export const getCategorys = (params) => {
    return apiClient({ method: "get", url: `/product-categories`, params });
};