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
import { NumberFormatter } from "@/components/component/Number-Formatter";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsCustomerByIdQuery, getTradesQuery } from "@/quires/quires";
import { useTranslation } from "react-i18next";

const initialParams = {
    client_id: "",
    employee_id: "",
    from_date: "",
    to_date: "",
    is_company: false,
    page: "1",
    limit: "100",
};

export default function ClientDrawer({
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
        enabled: !!selectedRowData?.id,
    });

    const { data: clients } = useQuery({
        ...getClientsCustomerByIdQuery(selectedRowData?.id),
        enabled: !!selectedRowData?.id,
    });

    useEffect(() => {
        setParams((prev) => ({ ...prev, client_id: selectedRowData?.id }));
    }, [selectedRowData]);

    const client = clients?.data;
    const trade = data?.data?.Data?.client_products;

    function forceConvertToNewDomain(url) {
        if (url) {
            const path = new URL(url).pathname;
            return `https://backend-secure.quyosh-panellari.uz${path}`;
        }
    }
    return (
        <CustomDrawer
            title="Klient"
            open={isSheetOpen}
            setOpen={setIsSheetOpen}
            trigger={
                <Button
                    onClick={infoClick(row.original)}
                    className="bg-primaryColor hover:bg-blue-500"
                >
                    <EyeIcon />
                </Button>
            }
            action={
                <div className="flex justify-between items-center gap-3">
                    <Button
                        className="p-5 w-[50%] bg-primaryColor hover:bg-primaryColor text-white"
                        onClick={() =>
                            navigate(`/createContract/${client.id}`)
                        }
                    >
                        {t("contract")}
                    </Button>
                    <Button
                        className="p-5 w-[50%] bg-green-600 hover:bg-green-600 text-white"
                        onClick={() =>
                            navigate(`/editClient/${client.id}`)
                        }
                    >
                        <EditIcon /> {t("edit")}
                    </Button>

                    <CustomDeleteDialog
                        endpoint={`client-customer`}
                        dynamicRowId={client?.id}
                        setIsOpen={setIsSheetOpen}
                        mutateQueryKey={"client-customers"}
                        deleteToastMessage={"clientDeleted"}
                    />
                </div>
            }
        >
            <div className="p-3">
                <div className="flex gap-10">
                    <img
                        src={
                            forceConvertToNewDomain(client?.file) || OptionalImg
                        }
                        alt=""
                        className="w-[260px] h-[200px] object-cover rounded-lg"
                    />
                    <div>
                        <h2 className="text-[26px] mb-2 capitalize">
                            {client?.first_name
                                ? client?.first_name +
                                  " " +
                                  client?.last_name +
                                  " " +
                                  client?.patronymic
                                : ""}
                        </h2>

                        <p className="mb-2">
                            <NumberFormatter
                                phone={client?.phone}
                                fontSize={"22px"}
                            />
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-5">
                    <div className="border p-3 rounded-md capitalize">
                        {client?.region}
                    </div>
                    <div className="border p-3 rounded-md capitalize">
                        {client?.district}
                    </div>
                    <div className="border p-3 rounded-md capitalize">
                        {client?.quarter}
                    </div>
                    <div className="border p-3 rounded-md capitalize">
                        {client?.street}
                    </div>
                </div>
                {data?.data?.Data?.count > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                            <div className="p-5 border dark:border-gray-600 rounded-md flex justify-between">
                                <p>KVT</p>
                                <p>
                                    {trade?.reduce((sum, item) => {
                                        return sum + (item.kv || 0);
                                    }, 0)}
                                </p>
                            </div>
                            <div className="p-5 dark:border-gray-600 border rounded-md flex justify-between">
                                <p>{t("grossProfit")}</p>
                                <p>
                                    {trade
                                        ?.reduce((sum, item) => {
                                            return (
                                                sum +
                                                (Number(item.total_price) || 0)
                                            );
                                        }, 0)
                                        .toLocaleString()}{" "}
                                    sum
                                </p>
                            </div>
                        </div>

                        <Table className="dark:bg-darkPrimaryColor rounded-md">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[5%]">#</TableHead>
                                    <TableHead className="w-[30%]">
                                        {t("date")}
                                    </TableHead>
                                    <TableHead className="w-[20%] text-center">
                                        {t("numberOfProducts")}
                                    </TableHead>
                                    <TableHead className="text-center w-[22%]">
                                        Kvt
                                    </TableHead>
                                    <TableHead className="text-right w-[22%]">
                                        {t("price")}
                                    </TableHead>

                                    <TableHead className="text-right">
                                        {t("actions")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trade &&
                                    trade?.map((item) => {
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="w-[5%]">
                                                    1
                                                </TableCell>
                                                <TableCell className="w-[26%]">
                                                    {item.created_at}
                                                </TableCell>
                                                <TableCell className="w-[18%] text-center">
                                                    {item?.items?.reduce(
                                                        (sum, qty) =>
                                                            (sum +=
                                                                qty?.quantity),
                                                        0
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-[26%] text-center">
                                                    {item.kv}
                                                </TableCell>
                                                <TableCell className="text-right w-[18%]">
                                                    {item?.total_price.toLocaleString()}{" "}
                                                </TableCell>
                                                <TableCell className="float-right">
                                                    <a
                                                        target="blank"
                                                        href={forceConvertToNewDomain(
                                                            item?.contract
                                                        )}
                                                    >
                                                        <Download
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </>
                ) : (
                    ""
                )}
            </div>
        </CustomDrawer>
    );
}
