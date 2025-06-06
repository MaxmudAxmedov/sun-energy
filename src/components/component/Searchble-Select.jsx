import React, { useEffect, useState } from "react";
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
import { useDebounce } from "use-debounce";
import { Spinner } from "./spinner";

export const SearchbleSelect = ({
  onValueChange,
  value,
  placeholder = "selectCategorys",
  options = [],
  onSearch = () => {},
  loading = false,
  emptyMessage = "noItemsFound",
  searchPlaceholder = "search",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handleSelect = (currentValue) => {
    onValueChange?.(currentValue);
    setOpen(false);
  };

  const selectedItem = options?.find((item) => item.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className="border rounded-[8px] dark:bg-darkBgInputs dark:border-darkBorderInput"
      >
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between h-[41px] font-normal bg-white shadow-none hover:bg-slate-50 text-darkPlacholderColor dark:text-darkPlacholderColor"
        >
          {value ? selectedItem?.name || t("loading") : t(placeholder)}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchQuery}
            placeholder={t(searchPlaceholder) + "..."}
            onChange={handleSearch}
          />

          <CommandList>
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <Spinner />
              </div>
            ) : options?.length === 0 ? (
              <CommandEmpty>{t(emptyMessage)}</CommandEmpty>
            ) : (
              <CommandGroup>
                {options?.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={handleSelect}
                    className="flex items-center justify-between"
                  >
                    {item.name}
                    {item.id === value && <Check className="h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
