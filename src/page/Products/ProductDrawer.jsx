import { CustomDrawer } from "@/components/component/CustomDrawer";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/assets/icons/edit-icon";
import OptionalImg from "@/assets/imgs/optional-img.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EyeIcon } from "@/assets/icons/eye-icon";
import { useQuery } from "@tanstack/react-query";
import { getCategorysQuery } from "@/quires/quires";
export default function ProductDrawer({
    isSheetOpen,
    setIsSheetOpen,
    row,
    selectedRowData,
    infoClick,
}) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data } = useQuery({
        ...getCategorysQuery({ limit: "100", page: "1", search: "" }),
    });
    // console.log(data?.data?.Data?.product_categories);
    return (
        <CustomDrawer
            title="Mahsulot"
            open={isSheetOpen}
            setOpen={setIsSheetOpen}
            trigger={
                <Button
                    variant="default"
                    onClick={infoClick(row.original)}
                    className="bg-primaryColor hover:bg-blue-500"
                >
                    <EyeIcon />
                </Button>
            }
            action={
                <div className="flex justify-between gap-3">
                    <Button
                        className="p-6 w-[100%] bg-green-600 hover:bg-green-600 text-white"
                        onClick={() =>
                            navigate(`/editProduct/${selectedRowData.id}`)
                        }
                    >
                        <EditIcon /> Edit
                    </Button>
                </div>
            }
        >
            <div className="p-3">
                <div className="flex gap-10">
                    <div className="relative">
                        <img
                            src={
                                selectedRowData?.file ||
                                selectedRowData?.photo ||
                                OptionalImg
                            }
                            alt=""
                            className="w-[260px] h-[200px] object-cover rounded-lg"
                        />
                        <span className="absolute -top-2.5 -left-3 bg-primaryColor text-white text-[13px] py-[2px] px-1.5 rounded-md">
                            {selectedRowData?.watt} W
                        </span>
                    </div>
                    <div>
                        <h2 className="text-[22px] capitalize mb-4">
                            {selectedRowData?.name}
                        </h2>

                        <p className="text-[20px] mb-4">
                            Mavjud mahsulot soni{" "}
                            {selectedRowData?.count_of_product} dona
                        </p>
                        <p className="text-[20px] mb-4">
                            {selectedRowData?.power_system
                                ? selectedRowData?.power_system
                                : ""}
                        </p>
                        <p className="text-[20px]">
                            {selectedRowData?.category_id &&
                                data?.data?.Data?.product_categories.find(
                                    (i) => i.id == selectedRowData?.category_id
                                )?.name}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-5">
                    <div className="border p-4 rounded-md relative">
                        <p className="absolute top-1 left-2 text-[12px]">
                            Narxi
                        </p>
                        <p className="float-right">
                            {Number(selectedRowData?.price).toLocaleString()}{" "}
                            sum
                        </p>
                    </div>

                    <div className="border p-4 rounded-md relative">
                        <p className="absolute top-1 left-2 text-[12px]">
                            Belgilangan foiz
                        </p>
                        <p className="float-right">
                            {selectedRowData?.mark_up} %
                        </p>
                    </div>

                    <div className="border p-4 rounded-md relative">
                        <p className="absolute top-1 left-2 text-[12px]">
                            Sotuv narxi
                        </p>
                        <p className="float-right">
                            {Number(
                                selectedRowData?.selling_price
                            ).toLocaleString()}{" "}
                            sum
                        </p>
                    </div>
                </div>
                <div className="mt-4 border-l-2  p-4">
                    <p>{selectedRowData?.description}</p>
                </div>

                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-5">
                    <div className="border p-4 rounded-md capitalize">
                        {selectedRowData?.region}
                    </div>
                    <div className="border p-4 rounded-md capitalize">
                        {selectedRowData?.district}
                    </div>
                    <div className="border p-4 rounded-md capitalize">
                        {selectedRowData?.quarter}
                    </div>
                    <div className="border p-4 rounded-md capitalize">
                        {selectedRowData?.street}
                    </div>
                </div> */}

                {/* <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                        <div className="p-8 border rounded-md flex justify-between">
                            <p>{selectedRowData?.cashback}</p>
                            <p>CASHBACK</p>
                        </div>
                        <div className=" p-8 border rounded-md flex justify-between">
                            <p>{selectedRowData?.salary.toLocaleString()}</p>
                            <p>UZS</p>
                        </div>
                    </div>
                </> */}
            </div>
        </CustomDrawer>
    );
}
