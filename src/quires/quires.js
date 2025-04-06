import { getProducts } from "@/service/product";

export function getProductsQuery(params) {
    return {
        queryKey: ["/product-categories", params],
        queryFn: async () => getProducts(params),
    };
}
