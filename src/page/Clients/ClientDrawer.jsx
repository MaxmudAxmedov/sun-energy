import { CustomDrawer } from "@/components/component/CustomDrawer";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@/assets/icons/eye-icon";
import { EditIcon } from "@/assets/icons/edit-icon";
import OptionalImg from "@/assets/imgs/optional-img.jpg";
import { useGetData } from "@/hook/useApi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import DownloadIcon from "@/assets/imgs/download.png";
import { useNavigate } from "react-router-dom";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { NumberFormatter } from "@/components/component/Number-Formatter";
import { Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTradesQuery } from "@/quires/quires";
const initialParams = {
    client_id: "",
    employee_id: "",
    from_date: "",
    to_date: "",
    is_company: true,
    page: "1",
    limit: "10",
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
    const { data, isLoading, isError } = useQuery({
        ...getTradesQuery(params),
    });

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
                            navigate(`/createContract/${selectedRowData.id}`)
                        }
                    >
                        Contract
                    </Button>
                    <Button
                        className="p-5 w-[50%] bg-green-600 hover:bg-green-600 text-white"
                        onClick={() =>
                            navigate(`/editClient/${selectedRowData.id}`)
                        }
                    >
                        <EditIcon /> Edit
                    </Button>

                    <CustomDeleteDialog
                        endpoint={`client`}
                        dynamicRowId={selectedRowData?.id}
                        setIsOpen={setIsSheetOpen}
                        mutateQueryKey={"clients"}
                        deleteToastMessage={"clientDeleted"}
                    />
                </div>
            }
        >
            <div className="p-3">
                <div className="flex gap-10">
                    <img
                        src={
                            selectedRowData?.file ||
                            selectedRowData?.photo ||
                            OptionalImg
                        }
                        alt=""
                        className="w-[260px] h-[200px] object-cover rounded-lg"
                    />
                    <div>
                        <h2 className="text-[26px] mb-2 capitalize">
                            {selectedRowData?.company_name
                                ? selectedRowData?.company_name
                                : ""}
                        </h2>
                        <p className="text-[20px] capitalize mb-2">
                            {selectedRowData?.full_name}
                        </p>
                        <p className="mb-2">
                            <NumberFormatter
                                phone={selectedRowData?.phone}
                                fontSize={"22px"}
                            />
                        </p>

                        {selectedRowData?.inn_number ? (
                            <p className="text-[20px]">
                                Inn:{"  "}
                                {selectedRowData?.inn_number}
                            </p>
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-5">
                    <div className="border p-3 rounded-md capitalize">
                        {selectedRowData?.region}
                    </div>
                    <div className="border p-3 rounded-md capitalize">
                        {selectedRowData?.district}
                    </div>
                    <div className="border p-3 rounded-md capitalize">
                        {selectedRowData?.quarter}
                    </div>
                    <div className="border p-3 rounded-md capitalize">
                        {selectedRowData?.street}
                    </div>
                </div>
                {data?.data?.Data?.count > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                            <div className="p-5 border rounded-md flex justify-between">
                                <p>
                                    {data?.data?.Data?.client_products?.reduce(
                                        (sum, item) => {
                                            return sum + (item.kv || 0);
                                        },
                                        0
                                    )}
                                </p>
                                <p>KVT</p>
                            </div>
                            <div className="p-5 border rounded-md flex justify-between">
                                <p>
                                    {data?.Data?.client_products
                                        ?.reduce((sum, item) => {
                                            return (
                                                sum + (item.total_price || 0)
                                            );
                                        }, 0)
                                        .toLocaleString()}{" "}
                                    sum
                                </p>
                                <p>Umumiy summa</p>
                            </div>
                        </div>

                        <Table className="dark:bg-darkPrimaryColor rounded-md">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[5%]">#</TableHead>
                                    <TableHead className="w-[30%]">
                                        Sana
                                    </TableHead>
                                    <TableHead className="w-[20%] text-center">
                                        Mahsulot soni
                                    </TableHead>
                                    <TableHead className="text-center w-[22%]">
                                        Kvt
                                    </TableHead>
                                    <TableHead className="text-center w-[22%]">
                                        Summa
                                    </TableHead>

                                    <TableHead className="float-right pt-2">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.Data?.client_products &&
                                    data?.Data?.client_products?.map((item) => {
                                        return (
                                            <TableRow>
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
                                                <TableCell className="text-center w-[18%]">
                                                    {item?.total_price.toLocaleString()}{" "}
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
