import { DynamicHeader } from "@/components/component/Dynamic-Header";
import React from "react";

export default function Cost() {
  return (
    <div>
      <DynamicHeader
        title="additional_expense"
        btnName="create"
        inputPlacholder="searchCost"
        btnNavigate="/createCost"
      />
    </div>
  );
}
