"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ComboboxProps<T extends Record<string, any>> = {
  items: T[]
  valueField: keyof T
  labelField: keyof T
  onSelect?: (item: T | null) => void
  value?: T | null
}

export function Combobox<T extends Record<string, any>>({
  items,
  valueField,
  labelField,
  onSelect,
  value: externalValue,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<T | null>(null)

  const selected = externalValue ?? internalValue

  const handleSelect = (item: T | null) => {
    setInternalValue(item)
    onSelect?.(item)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected
            ? String(selected[labelField])
            : "Select option..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const itemValue = String(item[valueField])

                return (
                  <CommandItem
                    key={itemValue}
                    value={itemValue}
                    onSelect={() =>
                      handleSelect(
                        selected?.[valueField] === item[valueField]
                          ? null
                          : item
                      )
                    }
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected?.[valueField] === item[valueField]
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {String(item[labelField])}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
