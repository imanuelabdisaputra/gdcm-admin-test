"use client"

import { useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/datePicker"

export type IScheduleItem = {
  name?: string
  date?: Date
  startTime?: string
  endTime?: string
}

type UserProps = {
  submit: (data: IScheduleItem) => void
  item?: IScheduleItem
  isLoading?: boolean
}

const ScheduleFormComponent = ({ submit, item, isLoading }: UserProps) => {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>()

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
    submit(data);
  }

  useEffect(() => {
    setValue("name", item?.name)
  }, [item?.name, setValue])

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
            <Input
              {...register("startTime", { required: true })}
              label="Jam Mulai"
              placeholder="Masukan Jam Mulai"
              errorMessage={errors.startTime && "This field is required"}
            />
            <Input
              {...register("endTime", { required: true })}
              label="Jam Selesai"
              placeholder="Masukan Jam Selesai"
              errorMessage={errors.endTime && "This field is required"}
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
