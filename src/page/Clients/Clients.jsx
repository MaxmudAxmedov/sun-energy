import { DynamicHeader } from "@/components/component/Dynamic-Header";
import React from "react";

export default function Clients() {
  return (
    <div>
      <DynamicHeader
        title="clients"
        btnName="createClient"
        inputPlacholder="searchClient"
        btnNavigate="/createClient"
      />
    </div>
  );
}
