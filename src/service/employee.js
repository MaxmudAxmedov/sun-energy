import apiClient from "@/config/apiClient";

export const getEmployeeById = (id) => {
    return apiClient({ method: "get", url: `/employee/${id}` });
};

export const paidEmployess = (id, paid) => {
    return apiClient({ method: "patch", url: `/employee/${id}/${paid}` });
};
