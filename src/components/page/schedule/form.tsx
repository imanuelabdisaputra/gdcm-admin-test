"use client"

import { useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/datePicker"
import Timepicker from "@/components/ui/timepicker"
import { toast } from "@/components/ui/use-toast";

export type IScheduleItem = {
  name: string
  date: Date
  startTime: string
  endTime: string
}

type IProps = {
  submit: (data: IScheduleItem) => void
  item?: IScheduleItem
  isLoading?: boolean
}

const ScheduleFormComponent = ({ submit, item, isLoading }: IProps) => {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState<string>()
  const [endTime, setEndTime] = useState<string>()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IScheduleItem>()

  const onSubmitDate = (val: Date) => {
    setValue("date", val)
    setDate(val)
  }

  const onSubmit: SubmitHandler<IScheduleItem> = async (data) => {
    const start = startTime!.replace(':', '')
    const end = endTime!.replace(':', '')
    if (start < end) {
      const item = {
        ...data,
        startTime: startTime || '',
        endTime: endTime || '',
      }
      submit(item);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Jam selesai harus lebih besar dari jam mulai",
      });
    }
  }

  useEffect(() => {
    item && setValue("name", item.name)
  }, [item, item?.name, setValue])

  return (
    <Card className="max-w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Tambah Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register("name", { required: true })}
              label="Nama Kegiatan"
              placeholder="Nama Kegiatan"
              errorMessage={errors.name && "This field is required"}
            />
            <DatePicker
              label="Tanggal"
              errorMessage={errors.date && "This field is required"}
              submit={onSubmitDate}
            />
            <Timepicker
              label="Jam Mulai"
              placeholder="Masukan Jam Mulai"
              onChange={(val) => setStartTime(val)}
            />
            <Timepicker
              label="Jam Selesai"
              placeholder="Masukan Jam Selesai"
              onChange={(val) => setEndTime(val)}
            />

            <div className="flex justify-between">
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
              <Button
                type="button"
                variant={"secondary"}
                disabled={isLoading}
                onClick={() => router.push("/schedule")}
              >
                Back
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ScheduleFormComponent
