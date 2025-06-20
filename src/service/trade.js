import apiClient from "@/config/apiClient";

export const deleteTrade = (id) => {
    return apiClient({ method: "delete", url: `/trade/${id}` });
};
