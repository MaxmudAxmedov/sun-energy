import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox({
  options = [],
  value,
  onChange = () => {},
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  searchPlaceholder = "Search...",
}) {
  // Ensure options is always an array and handle undefined/null cases
  const safeOptions = Array.isArray(options) ? options : []
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {(() => {
            // Handle the case when value is defined and options exist
            if (value && safeOptions.length > 0) {
              const selectedOption = safeOptions.find((option) => 
                option && option.value === value
              );
              return selectedOption?.label || placeholder;
            }
            return placeholder;
          })()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {safeOptions && safeOptions.length > 0 ? (
              safeOptions.map((option) => {
                // Ensure option is an object with value and label properties
                if (!option || typeof option !== 'object') return null;
                const optionValue = option.value ?? '';
                const optionLabel = option.label ?? '';
                
                return (
                  <CommandItem
                    key={optionValue}
                    value={optionValue}
                    onSelect={() => {
                      onChange(optionValue === value ? "" : optionValue)
                      setOpen(false)
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === optionValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {optionLabel}
                  </CommandItem>
                );
              })
            ) : (
              <CommandItem disabled>{emptyMessage}</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}