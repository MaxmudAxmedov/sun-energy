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
  const config = {
    method,
    url: endpoint,
    data,
    params,
  };

  if (!(data instanceof FormData)) {
    config.headers = {
      "Content-Type": "application/json",
    };
  }

  const response = await apiClient(config);
  return response.data;
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
    staleTime: 5 * 60 * 1000, // 5 min cashe
    casheTime: 10 * 60 * 1000, // 10 min cashe
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
      toast.success(t(variables.toastCreateMessage));
      client.invalidateQueries({ queryKey: [variables.mutateQueryKey] });
      {
        variables.navigatePath && navigateing(variables.navigatePath);
      }
      {
        variables.endpoint === "/verify" &&
          saveState("authToken", data.Data.access_token);
        saveState("refreshToken", data.Data.refresh_token);
      }
     
    },
    onError: (error) => {
      console.error("Mutation error:", error.response.data.Data);
      toast.error(error.response.data.Data);
    },
  });
};
