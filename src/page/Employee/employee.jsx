import { DynamicHeader } from "@/components/component/Dynamic-Header";
import React from "react";

export default function Employee() {
  return (
    <div>
      <DynamicHeader
        title="employee"
        btnName="createEmployee"
        inputPlacholder="searchEmployee"
        btnNavigate="createEmployee"
      />
    </div>
  );
}
