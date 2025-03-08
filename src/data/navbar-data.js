import { BaseIcon } from "@/assets/icons/base-icon";
import { ClientIcon } from "@/assets/icons/client-icon";
import { ContractIcon } from "@/assets/icons/contract-icon";
import { EmployeeIcon } from "@/assets/icons/employee-icon";
import { ProductIcon } from "@/assets/icons/product-icon";
import { ReportIcon } from "@/assets/icons/report-icon";
import { SettingIcon } from "@/assets/icons/setting-icon";

export const NavbarData = [
  {
    id: 1,
    title: "products",
    path: "/",
    icon: ProductIcon,
    subNav: "/createProduct",
  },
  {
    id: 2,
    title: "clients",
    path: "/clients",
    icon: ClientIcon,
    subNav: "/createClient",
  },
  {
    id: 3,
    title: "employee",
    path: "/employee",
    icon: EmployeeIcon,
    subNav: "/createEmployee",
  },
  {
    id: 4,
    title: "base",
    path: "/base",
    icon: BaseIcon,
    subNav: "/createBase",
  },
  {
    id: 5,
    title: "report",
    path: "/report",
    icon: ReportIcon,
    subNav: "/createReport",
  },
  {
    id: 6,
    title: "contract",
    path: "/contract",
    icon: ContractIcon,
    subNav: "/createContract",
  },
  {
    id: 7,
    title: "setting",
    path: "/setting",
    icon: SettingIcon,
  },
];
