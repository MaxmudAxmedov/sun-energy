import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useTranslation } from "react-i18next";

export const SearchbleSelect = ({
  onValueChange,
  value,
  placeholder = "selectCategorys",
}) => {
  //   const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const [selectedValue, setSelectedValue] = useState(value || "");
  console.log(selectedValue);

  const items = [
    { value: "item1", label: "Item 1" },
    { value: "item2", label: "Item 2" },
    { value: "item3", label: "Item 3" },
    { value: "item4", label: "Item 4" },
    { value: "item5", label: "Item 5" },
    { value: "item6", label: "Item 6" },
    { value: "item7", label: "Item 7" },
    { value: "item8", label: "Item 8" },
    { value: "item9", label: "Item 9" },
    { value: "item10", label: "Item 10" },
  ];
  
  const handleSelect = (currentValue) => {
    setSelectedValue(currentValue);
    onValueChange?.(currentValue);
    setOpen(false);
  };

  const selectedItem = items.find((item) => item.value === selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className="border rounded-[8px] dark:bg-darkBgInputs dark:border-darkBorderInput"
      >
        <Button
          // variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-[41px] font-normal bg-white shadow-none hover:bg-slate-50 text-darkPlacholderColor dark:text-darkPlacholderColor"
        >
          {selectedValue ? selectedItem?.label || "Loading..." : t(placeholder)}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={t("search") + "..."}
            // onValueChange={(search) => setSearchQuery(search)}
          />

          <CommandList>
            <CommandEmpty>Empty items</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                >
                  <Check />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
