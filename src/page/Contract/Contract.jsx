import { DynamicHeader } from "@/components/component/Dynamic-Header";
import React from "react";

export default function Contract() {
  return (
    <div>
      <DynamicHeader
        title="contract"
        btnName="create"
        inputPlacholder="searchContract"
        btnNavigate="createContract"
      />
    </div>
  );
}
