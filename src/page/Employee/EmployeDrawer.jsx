import { CustomDrawer } from "@/components/component/CustomDrawer";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@/assets/icons/eye-icon";
import { EditIcon } from "@/assets/icons/edit-icon";
import OptionalImg from "@/assets/imgs/optional-img.jpg";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { PriceFormater } from "@/components/component/Price-Formater";
import { NumberFormatter } from "@/components/component/Number-Formatter";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeByIdQuery, getTradesQuery } from "@/quires/quires";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EditPopover } from "@/components/component/Edit-Popover";
import { forceConvertDomain } from "@/lib/forceConvertDomain";
const initialParams = {
    client_id: "",
    employee_id: "",
    from_date: "",
    to_date: "",
    is_company: true,
    page: "1",
    limit: "10",
};
export default function EmployeDrawer({
    isSheetOpen,
    setIsSheetOpen,
    row,
    selectedRowData,
    infoClick,
}) {
    const navigate = useNavigate();
    const [params, setParams] = useState(initialParams);
    const { t } = useTranslation();
    const { data } = useQuery({
        ...getTradesQuery(params),
    });

    const { data: employee } = useQuery({
        ...getEmployeeByIdQuery(selectedRowData?.id),
        enabled: !!selectedRowData?.id,
    });

    useEffect(() => {
        setParams((prev) => ({ ...prev, employee_id: selectedRowData?.id }));
    }, [selectedRowData]);

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return (
        <CustomDrawer
            title="Xodim"
            open={isSheetOpen}
            setOpen={setIsSheetOpen}
            trigger={
                <Button
                    variant="default"
                    className="bg-primaryColor hover:bg-blue-500"
                    onClick={infoClick(row.original)}
                >
                    <EyeIcon />
                </Button>
            }
            action={
                <div className="flex justify-between items-center gap-3">
                    <Button
                        className="p-6 w-[100%] bg-green-600 hover:bg-green-600 text-white"
                        onClick={() =>
                            navigate(`/editEmployee/${selectedRowData?.id}`)
                        }
                    >
                        <EditIcon /> {t("edit")}
                    </Button>
                    <CustomDeleteDialog
                        dynamicRowId={employee?.data?.id}
                        endpoint={"employee"}
                        mutateQueryKey={"employees"}
                        deleteToastMessage={"employeeDeleted"}
                        setIsOpen={setIsSheetOpen}
                    />
                </div>
            }
        >
            <div className="p-3">
                <div className="flex gap-10">
                    <img
                        src={
                            forceConvertDomain(employee?.data?.photo) ||
                            OptionalImg
                        }
                        alt=""
                        className="w-[260px] h-[200px] object-cover rounded-lg"
                    />
                    <div>
                        <h2 className="text-[22px] capitalize mb-2 flex gap-3 flex-wrap">
                            <p>{employee?.data?.last_name}</p>
                            <p>{employee?.data?.first_name}</p>
                            <p>{employee?.data?.patronymic}</p>
                        </h2>
                        <NumberFormatter
                            phone={employee?.data?.phone}
                            fontSize={"22px"}
                        />
                        <h2 className="text-[20px] mt-2">
                            {capitalize(employee?.data?.position_name)}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                            <div className="capitalize">
                                {employee?.data?.region}
                            </div>
                            <div className="capitalize">
                                {employee?.data?.district}
                            </div>
                            <div className="capitalize">
                                {employee?.data?.quarter}
                            </div>
                            <div className="capitalize">
                                {employee?.data?.street}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                        {/* cashback */}
                        <div className="relative p-4 border dark:border-gray-600 rounded-md flex justify-between">
                            <span className="absolute -right-3 -top-4">
                                <EditPopover
                                    initialValue={
                                        employee?.data?.payments?.total_cashback
                                    }
                                    allData={employee?.data?.payments}
                                    customKey={"total_cashback"}
                                />
                            </span>
                            <p className="absolute top-[-14px] left-2">
                                {t("cashback")}
                            </p>
                            <p>
                                {Number(
                                    employee?.data?.payments?.total_cashback
                                )?.toLocaleString() || 0}
                            </p>
                            <p>UZS</p>
                        </div>

                        {/* status */}
                        <div className="relative p-4 border dark:border-gray-600 rounded-md flex justify-between">
                            <span className="absolute -right-3 -top-4">
                                <EditPopover
                                    allData={employee?.data?.payments}
                                    customKey={"balance_due"}
                                />
                            </span>

                            <p className="absolute top-[-14px] left-2">
                                {t("currentStatus")}
                            </p>
                            <p>
                                {Number(
                                    employee?.data?.payments?.balance_due
                                )?.toLocaleString() || 0}
                            </p>
                            <p>UZS</p>
                        </div>

                        {/* paid */}
                        <div className="relative p-4 border dark:border-gray-600 rounded-md flex justify-between">
                            <span className="absolute -right-3 -top-4">
                                <EditPopover
                                    initialValue={
                                        employee?.data?.payments?.total_paid
                                    }
                                    allData={employee?.data?.payments}
                                    customKey={"total_paid"}
                                />
                            </span>
                            <p className="absolute top-[-14px] left-2">
                                {t("paid")}
                            </p>
                            <p>
                                {Number(
                                    employee?.data?.payments?.total_paid
                                )?.toLocaleString() || 0}
                            </p>
                            <p>UZS</p>
                        </div>

                        {/* salary */}
                        <div className="relative p-4 border dark:border-gray-600 rounded-md flex items-center justify-between">
                            <span className="absolute -right-3 -top-4">
                                <EditPopover
                                    initialValue={
                                        employee?.data?.payments?.total_paid
                                    }
                                    allData={employee?.data?.payments}
                                    customKey={"total_salary"}
                                />
                            </span>

                            <p className="absolute top-[-14px] left-2">
                                {t("grossProfit")}
                            </p>

                            <p>
                                <PriceFormater
                                    price={
                                        employee?.data?.payments
                                            ?.total_salary || 0
                                    }
                                />
                            </p>
                            <p>UZS</p>
                        </div>
                    </div>

                    <Table className="bg-white dark:bg-darkPrimaryColor rounded-md">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[5%]">#</TableHead>
                                <TableHead className="w-[30%]">
                                    {t("date")}
                                </TableHead>
                                <TableHead className="w-[30%] text-center">
                                    {t("clients")}
                                </TableHead>
                                <TableHead className="text-center w-[15%]">
                                    Kvt
                                </TableHead>
                                <TableHead className="text-center w-[22%]">
                                    {t("price")}
                                </TableHead>

                                <TableHead className="float-right pt-2">
                                    {t("actions")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.data?.Data?.client_products &&
                                data?.data?.Data?.client_products?.map(
                                    (item) => {
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="w-[5%]">
                                                    1
                                                </TableCell>
                                                <TableCell className="w-[26%]">
                                                    {item.created_at}
                                                </TableCell>
                                                <TableCell className="w-[30%] text-center">
                                                    {item?.client_name}
                                                </TableCell>
                                                <TableCell className="w-[15%] text-center">
                                                    {item.kv}
                                                </TableCell>
                                                <TableCell className="text-center w-[18%]">
                                                    {Number(
                                                        item?.total_price
                                                    )?.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="float-right">
                                                    <a
                                                        target="blank"
                                                        href={item?.contract}
                                                    >
                                                        <Download
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </CustomDrawer>
    );
}
