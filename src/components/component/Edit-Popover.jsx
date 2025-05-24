import { Button } from "@/components/ui/button";
import { CustomEditIcon } from "@/assets/icons/custom-edit-icon";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "./spinner";

export function EditPopover(props) {
  const { initialValue, allData, customKey } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue || "");
  const popoverRef = useRef(null);

  const { t } = useTranslation();

  const { mutate, isPending } = useMutateData();

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    const handleResize = () => {
      if (popoverRef.current) {
        const rect = popoverRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        if (rect.right > windowWidth) {
          popoverRef.current.style.left = "auto";
          popoverRef.current.style.right = "0";
        } else {
          popoverRef.current.style.left = "0";
          popoverRef.current.style.right = "auto";
        }
      }
    };

    if (isOpen) {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const handleSave = () => {
    const makeData = {
      balance_due: customKey === "balance_due" && allData.balance_due,
      employee_id: allData.employee_id,
      total_cashback:
        customKey === "total_cashback" ? value : allData.total_cashback,
      total_paid: customKey === "total_paid" ? value : allData.total_paid,
      total_salary: customKey === "total_salary" ? value : allData.total_salary,
    };

    mutate({
      endpoint: `/employee-payments`,
      method: "PUT",
      data: makeData,
      toastCreateMessage: "changed",
      mutateQueryKey: `/employees`,
    });
    setIsOpen(false);
  };

  return (
    <div>
      {customKey !== "balance_due" && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full bg-gray-500 hover:bg-slate-600 w-[38px] h-[35px] mx-auto`}
        >
          <CustomEditIcon />
        </Button>
      )}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 mt-2 w-64 bg-[#676060] rounded-lg shadow-lg p-4"
        >
          <input
            type="text"
            value={value}
            // initialValue={initialValue}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ma'lumotni kiriting..."
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              {isPending ? <Spinner /> : t("save")}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
