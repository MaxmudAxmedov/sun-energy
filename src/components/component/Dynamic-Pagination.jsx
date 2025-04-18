import React from "react";
import { Button } from "../ui/button";
import { RightChevronIcon } from "@/assets/icons/right-chevron-icon";
import { LeftChevronIcon } from "@/assets/icons/left-chevron-icon";

export const DynamicPagination = ({ data, setPage, limit, page }) => {
  const totalItems = data?.Data?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex items-center gap-x-2 pb-[37px]">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        <LeftChevronIcon />
      </Button>
      <span>
        {page} --- {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        <RightChevronIcon />
      </Button>
    </div>
  );
};
