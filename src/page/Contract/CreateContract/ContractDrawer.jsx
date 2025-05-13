import { CustomDrawer } from "@/components/component/CustomDrawer";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/assets/icons/edit-icon";
import OptionalImg from "@/assets/imgs/optional-img.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function ContractDrawer({
    isSheetOpen,
    setIsSheetOpen,
    row,
    selectedRowData,
    infoClick,
}) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <CustomDrawer
            title="Mahsulot"
            open={isSheetOpen}
            setOpen={setIsSheetOpen}
            trigger={
                <p onClick={infoClick(row)} className="cursor-pointer">
                    {row.name}
                </p>
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
                            className="w-[260px] h-[200px] object-cover rounded-lg border"
                        />
                        {selectedRowData?.watt !== 0 && (
                            <span className="absolute -top-2.5 -left-3 bg-primaryColor text-white text-[16px] py-[2px] px-1.5 rounded-md">
                                {selectedRowData?.watt} W
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-[22px] capitalize mb-4">
                            {selectedRowData?.name}
                        </h2>
                        <h2></h2>
                        <h2 className="text-[20px] mb-4">
                            Mavjud mahsulot soni{" "}
                            <span className="font-semibold mx-1">
                                {selectedRowData?.count_of_product}
                            </span>
                            dona
                        </h2>
                        {/* <h2 className="text-[20px] mb-4">
                            {selectedRowData?.price.toLocaleString()} sum
                        </h2> */}
                        <h2 className="text-[20px] mb-4 ">
                            <span className="font-semibold mx-1">
                                {Number(
                                    selectedRowData?.selling_price
                                ).toLocaleString()}
                            </span>
                            sum
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-5">
                    <div className="border dark:border-gray-600 p-4 rounded-md flex items-center justify-between">
                        <p className=" text-[14px]">Narxi :</p>
                        <p className="float-right">
                            {Number(selectedRowData?.price).toLocaleString()}{" "}
                            sum
                        </p>
                    </div>

                    <div className="border dark:border-gray-600 p-4 rounded-md flex items-center justify-between">
                        <p className=" text-[14px]">Belgilangan foiz :</p>
                        <p className="float-right">
                            {selectedRowData?.mark_up} %
                        </p>
                    </div>

                    <div className="border dark:border-gray-600 p-4 rounded-md flex items-center justify-between">
                        <p className=" text-[14px]">Sotuv narxi :</p>
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
                {/* <div>
                    <div className="flex gap-x-2">
                        <p>{t("markUp")} :</p>
                        {selectedRowData?.mark_up} %
                    </div>
                    <div className="flex gap-x-2">
                        <p>{t("powerSystem")} :</p>
                        {selectedRowData?.power_system}
                    </div>
                </div> */}
            </div>
        </CustomDrawer>
    );
}
