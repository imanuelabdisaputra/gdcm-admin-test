"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/datePicker"
import TimePicker from "@/components/ui/timepicker"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormSchema } from "./types"

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<IScheduleItem>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  })

  const onSubmitDate = (val: Date) => {
    setValue("date", val)
    clearErrors("date")
  }

  const onChangeTime = (val: string, name: string) => {
    name == "startTime"
      ? (setValue("startTime", val), clearErrors("startTime"))
      : name == "endTime" && (setValue("endTime", val), clearErrors("endTime"))
  }

  const onSubmit: SubmitHandler<IScheduleItem> = async (data) => {
    const start = data.startTime!.replace(":", "")
    const end = data.endTime!.replace(":", "")
    if (start < end) {
      const item = {
        ...data,
        startTime: data.startTime || "",
        endTime: data.endTime || "",
      }
      submit(item);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Jam selesai harus lebih besar dari jam mulai",
      })
    }
  }

  return (
    <Card className="max-w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Tambah Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register("name", { required: true })}
              label="Nama Kegiatan"
              placeholder="Nama Kegiatan"
              error={errors.name}
            />
            <DatePicker
              label="Tanggal"
              errorMessage={errors.date?.message}
              submit={onSubmitDate}
            />
            <TimePicker
              label="Jam Mulai"
              placeholder="Masukan Jam Mulai"
              error={errors.startTime}
              onChange={(val) => onChangeTime(val, "startTime")}
            />
            <TimePicker
              label="Jam Selesai"
              placeholder="Masukan Jam Selesai"
              error={errors.endTime}
              onChange={(val) => onChangeTime(val, "endTime")}
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
