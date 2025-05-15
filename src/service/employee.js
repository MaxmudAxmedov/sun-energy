import apiClient from "@/config/apiClient";

export const getEmployeeById = (id) => {
    return apiClient({ method: "get", url: `/employee/${id}` });
};