import { getCategorys } from "@/service/category";
import {
    getBusinessClientById,
    getClientById,
    getClientsBusiness,
    getClientsCustomers,
} from "@/service/client";
import { getEmployeeById, getEmployees } from "@/service/employee";
import { getExpenseById, getExpenses } from "@/service/expense";
import { getProducts } from "@/service/product";
import { getReports, getTrade, getTrades } from "@/service/report";

export function getProductsQuery(params) {
    return {
        queryKey: ["/product", params.search],
        queryFn: async () => getProducts(params),
    };
}
export function getTradesQuery(params) {
    return {
        queryKey: ["trades", params],
        queryFn: async () => getTrades(params),
    };
}
export function getTradeQuery(params) {
    return {
        queryKey: ["trade", params],
        queryFn: async () => getTrade(params),
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
        queryKey: ["/client-businesses", params],
        queryFn: async () => getClientsBusiness(params),
    };
}

export function getClientsCustomersQuery(params) {
    return {
        queryKey: ["/client-customers", params],
        queryFn: async () => getClientsCustomers(params),
    };
}

export function getCategorysQuery(params) {
    return {
        queryKey: ["categorys", params],
        queryFn: async () => getCategorys(params),
    };
}

export function getEmployeeByIdQuery(id) {
    return {
        queryKey: ["employee-id", id],
        queryFn: async () => getEmployeeById(id),
    };
}

export function getEmployeesQuery(params) {
    return {
        queryKey: ["employees", params],
        queryFn: async () => getEmployees(params),
    };
}

export function getClientsBusinessByIdQuery(id) {
    return {
        queryKey: ["client-businesses-id", id],
        queryFn: async () => getBusinessClientById(id),
    };
}

export function getClientsCustomerByIdQuery(id) {
    return {
        queryKey: ["client-customer-id", id],
        queryFn: async () => getClientById(id),
    };
}

export function getExpensesQuery(params) {
    return {
        queryKey: ["/expenses", params],
        queryFn: async () => getExpenses(params),
    };
}

export function getExpenseByIdQuery(id) {
    return {
        queryKey: ["/expense-id", id],
        queryFn: async () => getExpenseById(id),
    };
}
