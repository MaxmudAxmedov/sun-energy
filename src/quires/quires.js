import { getProducts } from "@/service/product";

export function getProductsQuery(params) {
    return {
        queryKey: ["products", params],
        queryFn: async () => getProducts(params),
    };
}
