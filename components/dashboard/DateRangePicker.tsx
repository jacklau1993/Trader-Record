"use client"

import * as React from "react"
import { addDays, format, startOfMonth, endOfMonth, subDays, subMonths } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
    date: DateRange | undefined
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
    className?: string
}

export function DateRangePicker({
  date,
  setDate,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>(undefined)

  const handlePreset = (preset: string) => {
    const now = new Date()
    let from = new Date()
    let to = new Date()

    switch (preset) {
      case "today":
        from = now
        to = now
        break
      case "yesterday":
        from = subDays(now, 1)
        to = subDays(now, 1)
        break
      case "last7":
        from = subDays(now, 6)
        to = now
        break
      case "last30":
        from = subDays(now, 29)
        to = now
        break
      case "thisMonth":
        from = startOfMonth(now)
        to = endOfMonth(now)
        break
      case "lastMonth":
        from = startOfMonth(subMonths(now, 1))
        to = endOfMonth(subMonths(now, 1))
        break
    }
    setDate({ from, to })
    setSelectedPreset(preset)
    setIsOpen(false)
  }

  // Helpers for inputs
  const formatInputDate = (d?: Date) => d ? format(d, "yyyy-MM-dd") : ""
  
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value)
    if (!isNaN(d.getTime())) {
      setDate(prev => ({ from: d, to: prev?.to }))
      setSelectedPreset(undefined)
    }
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value)
    if (!isNaN(d.getTime())) {
      setDate(prev => ({ from: prev?.from, to: d }))
      setSelectedPreset(undefined)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[260px] justify-start text-left font-normal h-9",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-4 sm:w-auto sm:max-w-none"
          align="center"
          sideOffset={8}
          collisionPadding={16}
        >
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-col gap-2">
                    <h4 className="font-medium leading-none mb-1 text-sm text-muted-foreground">Presets</h4>
                    <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-col">
                        <Button 
                            variant={selectedPreset === "today" ? "secondary" : "ghost"} 
                            size="sm" 
                            className="justify-start font-normal" 
                            onClick={() => handlePreset("today")}
                        >
                            Today
                        </Button>
                        <Button 
                            variant={selectedPreset === "yesterday" ? "secondary" : "ghost"} 
                            size="sm" 
                            className="justify-start font-normal" 
                            onClick={() => handlePreset("yesterday")}
                        >
                            Yesterday
                        </Button>
                        <Button 
                            variant={selectedPreset === "last7" ? "secondary" : "ghost"} 
                            size="sm" 
                            className="justify-start font-normal" 
                            onClick={() => handlePreset("last7")}
                        >
                            Last 7 Days
                        </Button>
                        <Button 
                            variant={selectedPreset === "last30" ? "secondary" : "ghost"} 
                            size="sm" 
                            className="justify-start font-normal" 
                            onClick={() => handlePreset("last30")}
                        >
                            Last 30 Days
                        </Button>
                        <Button 
                            variant={selectedPreset === "thisMonth" ? "secondary" : "ghost"} 
                            size="sm" 
                            className="justify-start font-normal" 
                            onClick={() => handlePreset("thisMonth")}
                        >
                            This Month
                        </Button>
                        <Button 
                            variant={selectedPreset === "lastMonth" ? "secondary" : "ghost"} 
                            size="sm" 
                            className="justify-start font-normal" 
                            onClick={() => handlePreset("lastMonth")}
                        >
                            Last Month
                        </Button>
                    </div>
                </div>
                <div className="w-[1px] bg-border hidden sm:block"></div>
                <div className="flex w-full min-w-0 flex-col gap-2">
                     <h4 className="font-medium leading-none mb-1 text-sm text-muted-foreground">Custom Range</h4>
                     <div className="grid w-full gap-2">
                        <div className="grid gap-1">
                            <label className="text-xs font-medium">From</label>
                            <input 
                                type="date" 
                                className="flex h-9 min-w-0 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:[color-scheme:dark]"
                                value={formatInputDate(date?.from)}
                                onChange={handleFromChange}
                            />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-xs font-medium">To</label>
                            <input 
                                type="date" 
                                className="flex h-9 min-w-0 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:[color-scheme:dark]"
                                value={formatInputDate(date?.to)}
                                onChange={handleToChange}
                            />
                        </div>
                     </div>
                </div>
            </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
