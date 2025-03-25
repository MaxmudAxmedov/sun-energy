import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/config/apiClient";
import { client } from "@/config/client";
import { useNavigate } from "react-router-dom";
import { saveState } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const fetchData = async ({
    endpoint,
    method = "GET",
    data = null,
    params = {},
}) => {
    try {
        const config = {
            method,
            url: endpoint,
            data,
            params,
        };

        if (!(data instanceof FormData)) {
            config.headers = {
                "Content-Type": "application/json",
                ...(localStorage.getItem("authToken") && {
                    Authorization: `Bearer ${localStorage.getItem(
                        "authToken"
                    )}`,
                }),
            };
        }

        const response = await apiClient(config);

        if (!response.data) {
            throw new Error("Empty response from server");
        }

        return response.data;
    } catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
};

/// GET....
export const useGetData = ({
    endpoint,
    getQueryKey,
    params = {},
    enabled = true,
}) => {
    return useQuery({
        queryKey: [getQueryKey, params],
        queryFn: () => fetchData({ endpoint, params, method: "GET" }),
        enabled,
        // staleTime: 5 * 60 * 1000, // 5 min cashe
        // casheTime: 10 * 60 * 1000, // 10 min cashe
    });
};

/// POST, DELETE and PUT....
export const useMutateData = () => {
    const navigateing = useNavigate();
    const { t } = useTranslation();
    return useMutation({
        mutationFn: ({ endpoint, method = "POST", data }) =>
            fetchData({ endpoint, method, data }),
        onSuccess: (data, variables) => {
            if (variables.toastCreateMessage) {
                toast.success(t(variables.toastCreateMessage));
            }

            if (variables.mutateQueryKey) {
                client.invalidateQueries({
                    queryKey: [variables.mutateQueryKey],
                });
            }

            if (variables.navigatePath) {
                navigateing(variables.navigatePath);
            }

            if (variables.endpoint === "/verify") {
                if (data?.Data?.access_token) {
                    saveState("authToken", data.Data.access_token);
                } else {
                    console.warn("Access token not found in response");
                }

                if (data?.Data?.refresh_token) {
                    saveState("refreshToken", data.Data.refresh_token);
                } else {
                    console.warn("Refresh token not found in response");
                }
            }
        },
        onError: (error) => {
            console.error("Mutation error:", error);
            const errorMessage =
                error.response?.data?.Data?.message ||
                error.message ||
                t("errors.unknown_error");
            toast.error(errorMessage);
        },
    });
};
