import React from "react";

export const ClientIcon = () => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={12}
        cy={8}
        r={4}
        stroke="currentColor"
        strokeWidth={2}
        // className={pathname === "/clients" ? "stroke-blue-500" : "stroke-black"}
      />
      <path
        // className={pathname === "/clients" ? "stroke-blue-500" : "stroke-black"}
        d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
};
