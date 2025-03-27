import { BaseIcon } from "@/assets/icons/base-icon";
import { ClientIcon } from "@/assets/icons/client-icon";
import { ContractIcon } from "@/assets/icons/contract-icon";
import { EmployeeIcon } from "@/assets/icons/employee-icon";
import { PositionIcon } from "@/assets/icons/position-icon";
import { ProductCategoryIcon } from "@/assets/icons/product-category-icon";
import { ProductIcon } from "@/assets/icons/product-icon";
import { ReportIcon } from "@/assets/icons/report-icon";
import { SettingIcon } from "@/assets/icons/setting-icon";

export const NavbarData = [
  {
    id: 6,
    title: "report",
    path: "/report",
    icon: ReportIcon,
    subNav: "/createReport",
  },
  {
    id: 1,
    title: "products",
    path: "/",
    icon: ProductIcon,
    subNav: "/createProduct",
  },
  {
    id: 2,
    title: "productCategory",
    path: "/productCategory",
    icon: ProductCategoryIcon,
    subNav: "/createProductCategory",
  },
  {
    id: 3,
    title: "clients",
    path: "/clients",
    icon: ClientIcon,
    subNav: "/createClient",
  },
  {
    id: 4,
    title: "employee",
    path: "/employee",
    icon: EmployeeIcon,
    subNav: "/createEmployee",
  },
  {
    id: 7,
    title: "contract",
    path: "/contract",
    icon: ContractIcon,
    subNav: "/createContract",
  },
  {
    id: 8,
    title: "position",
    path: "/position",
    icon: PositionIcon,
    subNav: "/createPosition",
  },
  {
    id: 9,
    title: "setting",
    path: "/setting",
    icon: SettingIcon,
  },
];
