import React, { useEffect, useState } from "react";
import { Spinner } from "./spinner";
import { useMutateData } from "@/hook/useApi";
import { useTranslation } from "react-i18next";

export const TimerButtun = ({
  rowId,
  onOpen,
  open,
  endpoint,
  mutateQueryKey,
}) => {
  console.log(rowId);
  const [timer, setTimer] = useState(5);
  const [isButtunEnabled, setIsButtunEnabled] = useState(false);
  const { t } = useTranslation();

  const { mutate, isLoading: muatateLoading } = useMutateData();

  const handleDeleteEmployee = (productCategoryId) => {
    mutate({
      endpoint: `/${endpoint}/${productCategoryId}`,
      method: "DELETE",
      toastCreateMessage: "productCategoryDeleted",
      mutateQueryKey: `/${mutateQueryKey}`,
    });
  };

  const handleDelete = () => {
    if (isButtunEnabled) {
      handleDeleteEmployee(rowId);
      onOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      setTimer(5);
      setIsButtunEnabled(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsButtunEnabled(true);
    }
  }, [timer, open]);
  return (
    <div>
      <button
        disabled={!isButtunEnabled}
        onClick={handleDelete}
        className="bg-red-600 text-white pb-2 pt-[6px] hover:bg-red-700 transition-all duration-150 px-2 rounded-[5px]"
      >
        {isButtunEnabled ? (
          t("agree")
        ) : muatateLoading ? (
          <Spinner />
        ) : (
          <span className="w-[80px] block">{timer} s</span>
        )}
      </button>
    </div>
  );
};
