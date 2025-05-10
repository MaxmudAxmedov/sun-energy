import { getCategorys } from "@/service/category";
import { getClientsBusiness, getClientsCustomers } from "@/service/client";
import { getProducts } from "@/service/product";
import { getReports } from "@/service/report";

export function getProductsQuery(params) {
    return {
        queryKey: ["/product", params.search],
        queryFn: async () => getProducts(params),
    };
}
export function getReportsQuery(params) {
    return {
        queryKey: ["reports", params],
        queryFn: async () => getReports(params),
    };
}

export function getClientsBusinessQuery(params) {
    return {
        queryKey: ["client-businesses", params],
        queryFn: async () => getClientsBusiness(params),
    };
}

export function getClientsCustomersQuery(params) {
    return {
        queryKey: ["client-customers", params],
        queryFn: async () => getClientsCustomers(params),
    };
}

export function getCategorysQuery(params) {
    return {
        queryKey: ["categorys", params],
        queryFn: async () => getCategorys(params),
    };
}
