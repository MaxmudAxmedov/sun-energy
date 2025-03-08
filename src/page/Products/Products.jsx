import { DynamicHeader } from "@/components/component/Dynamic-Header";
import React from "react";

export default function Products() {
  return (
    <div>
      <DynamicHeader title="products" btnName="createProduct" inputPlacholder="searchProduct" btnNavigate="createProduct"/>
    </div>
  );
}
