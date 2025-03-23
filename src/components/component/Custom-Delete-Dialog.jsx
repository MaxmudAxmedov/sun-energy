import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DeleteIcon } from "@/assets/icons/delete-icon";
import { Button } from "../ui/button";
import { TimerButtun } from "./Timer-Buttun";

export const CustomDeleteDialog = ({
  dynamicRowId,
  endpoint,
  mutateQueryKey,
}) => {
  const [open, setOpne] = useState(false);
  const { t } = useTranslation();

  const handelOpenChange = (newOpen) => {
    if (!newOpen) {
      return;
    }
    setOpne(newOpen);
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={handelOpenChange}>
        <DialogTrigger className="hover:scale-110 bg-red-600 transition-all duration-150 py-[7px] px-2 rounded-[25px]">
          <DeleteIcon />
        </DialogTrigger>
        <DialogContent className="max-w-[350px] p-3 pt-0">
          <DialogHeader>
            <DialogTitle className="text-center">
              <p className="font-extrabold text-[40px]">!</p>
              {t("areYouSure")}
            </DialogTitle>
            <DialogDescription className="flex justify-center pt-2 items-center gap-2">
              <Button
                onClick={() => setOpne(false)}
                variant="default"
                className=" pb-2 pt-[6px] px-2 rounded-[5px]"
              >
                {t("cencel")}
              </Button>
              <TimerButtun
                rowId={dynamicRowId}
                endpoint={endpoint}
                mutateQueryKey={mutateQueryKey}
                onOpen={setOpne}
                open={open}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
