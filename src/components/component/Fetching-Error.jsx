import React from "react";
import { useTranslation } from "react-i18next";

export const FetchingRrror = () => {
  const { t } = useTranslation();
  return (
    <div className="desktop:mt-20 tablet:mt-16 mt-12">
      <h1 className="font-bold desktop:text-[50px] tablet:text-[40px] text-[30px] text-center">
        !{t("error")}
      </h1>
      <p className="font-semibold desktop:text-[30px] tablet:text-[26px] text-[20px] text-center">
        {t("fetchingError")}
      </p>
    </div>
  );
};
