import { DynamicHeader } from "@/components/component/Dynamic-Header";
import React from "react";

export default function Base() {
  return (
    <div>
      <DynamicHeader
        title="base"
        btnName="create"
        inputPlacholder="searchBase"
        btnNavigate="createBase"
      />
    </div>
  );
}
