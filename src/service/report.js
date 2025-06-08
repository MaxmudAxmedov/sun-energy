import apiClient from "@/config/apiClient";

export const getReports = (params) => {
    return apiClient({ method: "get", url: `/reports`, params });
};

export const getTrades = (params) => {
    return apiClient({ method: "get", url: `/trades-reports`, params });
};

export const getTrade = (params) => {
    return apiClient({ method: "get", url: `/trade`, params });
};
