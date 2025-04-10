import { getProducts } from "@/service/product";
import { getReports } from "@/service/report";

export function getProductsQuery(params) {
    return {
        queryKey: ["/product-categories", params],
        queryFn: async () => getProducts(params),
    };
}
export function getReportsQuery(params) {
    return {
        queryKey: ["reports", params],
        queryFn: async () => getReports(params),
    };
}

