"use client"

import { useState } from "react"
import { format, setDefaultOptions } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface IProps {
  value?: Date
  label?: string
  errorMessage?: string
  className?: string
  submit?: (data: Date) => void
}

export function DatePicker({
  submit,
  value,
  label,
  className,
  errorMessage,
}: IProps) {
  const [date, setDate] = useState<Date | undefined>(value)
  const [open, setOpen] = useState(false)

  setDefaultOptions({ locale: id })

  const onOpenChange = (val: boolean) => {
    setOpen(val)
  }

  const onSubmit = (val: Date | undefined) => {
    if (val) {
      setDate(val)
      submit?.(val)
      setOpen(false)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Popover modal={open} open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pilih Tanggal</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSubmit}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
