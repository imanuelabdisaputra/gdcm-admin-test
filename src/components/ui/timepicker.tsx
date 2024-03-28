import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Label } from "./label"

interface IProps {
  label: string
  placeholder?: string
  onChange: (val: string) => void
}

function CustomTimePicker({ label, placeholder, onChange }: IProps) {
  const [times, setTimes] = useState<string[]>([])

  const onChangeSelect = (val: string) => {
    onChange(val)
  }

  useEffect(() => {
    const createTimeOptions = (interval = 30) => {
      const options = []

      const formatTime = (hour: number, minute: number) =>
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`

      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          options.push(formatTime(hour, minute))
        }
      }
      return options
    }

    setTimes(createTimeOptions())
  }, [])

  return (
    <div>
      <Label>{label}</Label>
      <Select onValueChange={onChangeSelect}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="item-aligned" sideOffset={5}>
          {times && (
            times.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))
            // <SelectGroup>
            // </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export default CustomTimePicker
