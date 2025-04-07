import apiClient from "@/config/apiClient";

export const getReports = (params) => {
    return apiClient({ method: "get", url: `/trades`, params });
};