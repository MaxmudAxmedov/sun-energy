import apiClient from "@/config/apiClient";

export const getProducts = (params) => {
    return apiClient({ method: "get", url: `/products`, params });
};

export const createProducts = (data) => {
    return apiClient({ method: "post", url: `/products`, data });
};

export const updateProducts = (id, data) => {
    return apiClient({ method: "put", url: `/products/${id}`, data });
};

export const deleteProducts = (id) => {
    return apiClient({ method: "delete", url: `/products/${id}` });
};
