import apiClient from "@/config/apiClient";

export const createExpense = (data) => {
    return apiClient({ method: "post", url: `/expense`, data });
};

export const getExpenses = (params) => {
    return apiClient({ method: "get", url: `/expenses`, params });
};

export const getExpenseById = (id) => {
    return apiClient({ method: "get", url: `/expense/${id}` });
};

export const updateExpense = (data) => {
    return apiClient({ method: "put", url: `/expense`, data });
};
