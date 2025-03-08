import { DynamicHeader } from "@/components/component/Dynamic-Header";
import React from "react";

export default function Report() {
  return (
    <div>
      <DynamicHeader
        title="report"
        btnName="createReport"
        inputPlacholder="searchReport"
        btnNavigate="createReport"
      />
    </div>
  );
}
