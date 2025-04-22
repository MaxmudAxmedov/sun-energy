import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
// import dayjs from "dayjs";
import OptionalImg from "@/assets/imgs/optional-img.jpg";
import { useTranslation } from "react-i18next";

export const DynamicDrawer = ({
  selectedRowData,
  isSheetOpen,
  setIsSheetOpen,
}) => {
    console.log(selectedRowData);
  const { t } = useTranslation();

  const formatPrice = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.price
  );
  const formatTotalPrice = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.total_price
  );
  const formatServiceCost = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.service_cost
  );
  const formatAccessoryCost = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.accessory_cost
  );

  return (
    <Drawer direction="right" open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <DrawerContent className="overflow-y-scroll overflow-x-hidden">
        <DrawerHeader>
          <h1 className="tablet:text-[28px] tablet:pb-2">{t("infos")} :</h1>
          <DrawerTitle className="flex flex-col gap-y-5 tablet:pb-4">
            <div className="flex items-start gap-x-10">
              <img
                src={
                  selectedRowData?.file || selectedRowData?.photo || OptionalImg
                }
                alt=""
                className="w-[200px] h-[160px] object-cover"
              />
              <div className="space-y-3">
                <div className="flex items-center gap-x-2">
                  {/* Name */}
                  {selectedRowData?.name && (
                    <p className="text-[#ece4e4]">{selectedRowData?.name}</p>
                  )}
                  {/* Last Name */}
                  {selectedRowData?.last_name && (
                    <p className="text-[#ece4e4]">
                      {selectedRowData?.last_name}
                    </p>
                  )}
                  {/* First Name */}
                  {selectedRowData?.first_name && (
                    <p className="text-[#ece4e4]">
                      {selectedRowData?.first_name}
                    </p>
                  )}
                  {/* Full Name */}
                  {selectedRowData?.full_name && (
                    <p className="text-[#ece4e4] text-[20px]">
                      {selectedRowData?.full_name}
                    </p>
                  )}
                  {/* client_name */}
                  {selectedRowData?.client_name && (
                    <p className="text-[#ece4e4]">
                      {selectedRowData?.client_name}
                    </p>
                  )}
                  {/* patronymic */}
                  {selectedRowData?.patronymic && (
                    <p className="text-[#ece4e4]">
                      {selectedRowData?.patronymic}
                    </p>
                  )}
                </div>

                {/* Phone */}
                {selectedRowData?.phone && (
                  <p className="text-[#ece4e4]">+{selectedRowData?.phone}</p>
                )}
                {/* Passport_seria */}
                {selectedRowData?.passport_series && (
                  <p className="text-[#ece4e4]">
                    {selectedRowData?.passport_series}
                  </p>
                )}
                {/* Position  */}
                {selectedRowData?.position_name && (
                  <p className="text-[#ece4e4]">
                    {selectedRowData?.position_name}
                  </p>
                )}
              </div>
            </div>
            {/* description */}
            {selectedRowData?.description && (
              <p className="text-[#ece4e4]">{selectedRowData?.description}</p>
            )}

            <div className="pl-6 flex items-center gap-x-[80px] mt-4">
              <div className="space-y-4">
                {/* Region */}
                {selectedRowData?.region && (
                  <p className="text-[#ece4e4]">{selectedRowData?.region}</p>
                )}
                {/* quarter */}
                {selectedRowData?.quarter && (
                  <p className="text-[#ece4e4]">{selectedRowData?.quarter}</p>
                )}
              </div>
              <div className="space-y-4">
                {/* Discrit */}
                {selectedRowData?.district && (
                  <p className="text-[#ece4e4]">{selectedRowData?.district}</p>
                )}
                {/* Street */}
                {selectedRowData?.street && (
                  <p className="text-[#ece4e4]">{selectedRowData?.street}</p>
                )}
              </div>
            </div>

            {/* company_name */}
            {selectedRowData?.company_name && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("companyName")}:
                <p className="dark:text-white text-indigo-700">
                  {selectedRowData?.company_name}
                </p>
              </span>
            )}
            {/* inn_number */}
            {selectedRowData?.inn_number === Number() && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("innNumber")}:
                <p className="dark:text-white text-indigo-700">
                  {selectedRowData?.inn_number}
                </p>
              </span>
            )}
            {/* Balance */}
            {selectedRowData?.balance === Number() && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("balance")}:
                <p className="dark:text-white text-indigo-700">
                  {selectedRowData?.balance}
                </p>
              </span>
            )}
            {/* count_of_clients  */}
            {selectedRowData?.count_of_clients && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("countOfClients")}:
                <p className="dark:text-white text-indigo-700">
                  {selectedRowData?.count_of_clients}
                </p>
              </span>
            )}
            {/* Price */}
            {selectedRowData?.price && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("price")}:
                <p className="dark:text-white text-indigo-700">{formatPrice}</p>
              </span>
            )}
            {/* count_of_product */}
            {selectedRowData?.count_of_product && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("countOfProduct")}:
                <p className="dark:text-white text-indigo-700">
                  {selectedRowData?.count_of_product}
                </p>
              </span>
            )}
            {/* Products */}
            {selectedRowData?.items && (
              <span className="flex items-center gap-x-3 text-indigo-900 dark:text-indigo-300">
                {t("products")}:
                <p className="dark:text-white text-indigo-700">
                  {selectedRowData?.items?.length}
                </p>
              </span>
            )}
            {/* accessory_cost */}
            {selectedRowData?.accessory_cost && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("accessoryCost")}:
                <p className="dark:text-white text-indigo-700">
                  {formatAccessoryCost}
                </p>
              </span>
            )}
            {/* service_cost */}
            {selectedRowData?.service_cost && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("serviceCost")}:
                <p className="dark:text-white text-indigo-700">
                  {formatServiceCost}
                </p>
              </span>
            )}
            {/* total_price */}
            {selectedRowData?.total_price && (
              <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                {t("totalPrice")}:
                <p className="dark:text-white text-indigo-700">
                  {formatTotalPrice}
                </p>
              </span>
            )}
          </DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
