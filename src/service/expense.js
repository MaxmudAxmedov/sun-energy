import apiClient from "@/config/apiClient";

export const createExpense = (data) => {
    return apiClient({ method: "post", url: `/expense`, data });
};

export const getExpenses = (params) => {
    return apiClient({ method: "get", url: `/expenses`, params });
};
