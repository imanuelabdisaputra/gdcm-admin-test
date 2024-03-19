"use client"

import { useState } from "react"
import { format, setDefaultOptions } from "date-fns"
import { id } from 'date-fns/locale'
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type IProps = {
  value?: Date
  submit?: (data: Date) => void
}
export function DatePicker({ submit, value }: IProps) {
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
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
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
  )
}
