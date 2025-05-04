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
import { PriceFormater } from "@/components/component/Price-Formater";
import { NumberFormatter } from "@/components/component/Number-Formatter";
export default function EmployeDrawer({
  isSheetOpen,
  setIsSheetOpen,
  row,
  selectedRowData,
  infoClick,
}) {
  const navigate = useNavigate();
  const { data } = useGetData({
    endpoint: "/trades",
    getQueryKey: "/trades",
    params: {
      limit: "10",
      page: "1",
      employee_id: selectedRowData?.id,
    },
  });
  console.log(selectedRowData);

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
            onClick={() => navigate(`/editEmployee/${selectedRowData.id}`)}
          >
            <EditIcon /> Edit
          </Button>
          <CustomDeleteDialog
            dynamicRowId={selectedRowData?.id}
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
            src={selectedRowData?.file || selectedRowData?.photo || OptionalImg}
            alt=""
            className="w-[260px] h-[200px] object-cover rounded-lg"
          />
          <div>
            <h2 className="text-[22px] capitalize mb-2 flex gap-3 flex-wrap">
              <p>{selectedRowData?.last_name}</p>
              <p>{selectedRowData?.first_name}</p>
              <p>{selectedRowData?.patronymic}</p>
            </h2>
            <h2></h2>
            <NumberFormatter phone={selectedRowData?.phone} fontSize={"22px"} />
            <h2 className="text-[20px] mb-4">
              {capitalize(selectedRowData?.position_name)}
            </h2>
          </div>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-5">
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
        </div>

        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <div className="p-8 border rounded-md flex justify-between">
              <p>{selectedRowData?.cashback}</p>
              <p>CASHBACK</p>
            </div>
            <div className=" p-8 border rounded-md flex justify-between">
              <PriceFormater price={selectedRowData?.salary} />
              <p>UZS</p>
            </div>
          </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
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

                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="p-4 border rounded-md flex justify-between">
                            <p>{selectedRowData?.cashback}</p>
                            <p>CASHBACK</p>
                        </div>
                        <div className=" p-4 border rounded-md flex justify-between">
                            <p>{selectedRowData?.salary.toLocaleString()}</p>
                            <p>UZS</p>
                        </div>
                    </div>


          <Table className="bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5%]">#</TableHead>
                <TableHead className="w-[30%]">Sana</TableHead>
                <TableHead className="w-[30%] text-center">Klient</TableHead>
                <TableHead className="text-center w-[15%]">Kvt</TableHead>
                <TableHead className="text-center w-[22%]">Summa</TableHead>


                <TableHead className="float-right pt-2">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.Data?.client_products &&
                data?.Data?.client_products?.map((item) => {
                  return (
                    <TableRow>
                      <TableCell className="w-[5%]">1</TableCell>
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
                        {item?.total_price.toLocaleString()}{" "}
                      </TableCell>
                      <TableCell className="float-right">
                        <a target="blank" href={item?.contract}>
                          <img src={DownloadIcon} width={20} alt="" />
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </>
      </div>
    </CustomDrawer>
  );

                                <TableHead className="float-right pt-2">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.Data?.client_products &&
                                data?.Data?.client_products?.map((item, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell className="w-[5%]">
                                                {index+1}
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
                                                {item?.total_price.toLocaleString()}{" "}
                                            </TableCell>
                                            <TableCell className="float-right">
                                                <a
                                                    target="blank"
                                                    href={item?.contract}
                                                >
                                                    <img
                                                        src={DownloadIcon}
                                                        width={20}
                                                        alt=""
                                                    />
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </>
            </div>
        </CustomDrawer>
    );
}
