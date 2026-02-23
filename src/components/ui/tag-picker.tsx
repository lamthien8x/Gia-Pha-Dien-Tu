import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"

export type TagOption = {
    value: string
    label: string
    icon?: React.ReactNode
    avatar?: React.ReactNode
}

interface TagPickerProps {
    options: TagOption[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    emptyText?: string
    searchPlaceholder?: string
    onCreate?: (value: string) => void
    createLabel?: string
}

export function TagPicker({
    options,
    value,
    onChange,
    placeholder = "Chọn tags...",
    emptyText = "Không tìm thấy.",
    searchPlaceholder = "Tìm kiếm...",
    onCreate,
    createLabel = "Tạo mới"
}: TagPickerProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const handleSelect = (currentValue: string) => {
        const newValue = value.includes(currentValue)
            ? value.filter((val) => val !== currentValue)
            : [...value, currentValue]
        onChange(newValue)
        // Keep popover open for multi-select
    }

    const handleRemove = (v: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(value.filter((val) => val !== v))
    }

    const selectedOptions = options.filter(opt => value.includes(opt.value))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-[40px] px-3 py-2 text-left font-normal"
                >
                    <div className="flex flex-wrap gap-1 flex-1 items-center overflow-hidden">
                        {selectedOptions.length > 0 ? (
                            selectedOptions.map((opt) => (
                                <Badge
                                    key={opt.value}
                                    variant="secondary"
                                    className="gap-1 pr-1 font-medium bg-muted/50"
                                >
                                    {opt.icon && <span className="text-muted-foreground mr-1 flex items-center">{opt.icon}</span>}
                                    {opt.avatar && <span className="mr-1 flex items-center">{opt.avatar}</span>}
                                    {opt.label}
                                    <div
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer p-0.5 hover:bg-muted"
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => handleRemove(opt.value, e)}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </div>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command
                    shouldFilter={false} // We will handle filtering manually so we can detect "not found" easily
                >
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>
                            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                {emptyText}
                                {onCreate && search && (
                                    <Button size="sm" variant="outline" onClick={() => onCreate(search)}>
                                        {createLabel} "{search}"
                                    </Button>
                                )}
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase())).map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        {option.icon && <span className="text-muted-foreground">{option.icon}</span>}
                                        {option.avatar && <span>{option.avatar}</span>}
                                        <span>{option.label}</span>
                                    </div>
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value.includes(option.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
