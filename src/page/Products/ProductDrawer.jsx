import { CustomDrawer } from "@/components/component/CustomDrawer";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@/assets/icons/eye-icon";
import { EditIcon } from "@/assets/icons/edit-icon";
import OptionalImg from "@/assets/imgs/optional-img.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function ProductDrawer({
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
            onClick={() => navigate(`/editProduct/${selectedRowData.id}`)}
          >
            <EditIcon /> Edit
          </Button>
        </div>
      }
    >
      <div className="p-3">
        <div className="flex gap-10">
          <img
            src={selectedRowData?.file || selectedRowData?.photo || OptionalImg}
            alt=""
            className="w-[260px] h-[200px] object-cover rounded-lg"
          />
          <div>
            <h2 className="text-[22px] capitalize mb-4">
              {selectedRowData?.name}
            </h2>
            <h2></h2>
            <h2 className="text-[20px] mb-4">
              Mavjud mahsulot soni {selectedRowData?.count_of_product} dona
            </h2>
            <h2 className="text-[20px] mb-4">
              {selectedRowData?.price.toLocaleString()} sum
            </h2>
          </div>
        </div>

        <div className="mt-4 border-l-2  p-4">
          <p>{selectedRowData?.description}</p>
          <p>
            {selectedRowData?.watt} {t("watt")}
          </p>
          <div className="flex gap-x-2">
            <p>{t("markUp")} :</p>
            {selectedRowData?.mark_up} %
          </div>
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
