"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import supabase from "@/config/supabaseClient"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Spinner from "@/components/ui/spinner"
import formatDate from "@/lib/format"
import allLocales from "@fullcalendar/core/locales-all"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

const SchedulePage = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [detail, setDetail] = useState<any>()

  const header = {
    left: "prev",
    center: "title",
    right: "next",
  }
  const titleFormat: any = {
    month: "long",
  }
  const dayHeader: any = {
    weekday: "short",
    day: "numeric",
    omitCommas: true,
  }

  const labelFormat: any = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }

  const fetchItems = async () => {
    const { data: schedule, error } = await supabase.from("schedule").select()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching schedule: " + error.message,
      })
    }
    if (schedule) {
      const data = schedule.map((item) => {
        const date = formatDate(item.date, "yyyy-MM-dd")
        return {
          title: item.name,
          start: `${date}T${item.start_time}`,
          end: `${date}T${item.end_time}`,
        }
      })
      setItems(data)
      setLoading(false)
    }
  }

  const onClick = (val: any) => {
    setModal(true)
    setDetail(val)
  }

  const onDateClick = (val: any) => {
    console.log(val)
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Schedule</p>
        <Button onClick={() => router.push("/schedule/create")}>Create</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={header}
            titleFormat={titleFormat}
            height="auto"
            dayHeaderFormat={dayHeader}
            nowIndicator
            allDaySlot={false}
            slotLabelFormat={labelFormat}
            events={items}
            locales={allLocales}
            locale="id"
            selectable
            eventClick={onClick}
            dateClick={onDateClick}
          />
        </>
      )}

      {modal && (
        <Dialog open={modal} onOpenChange={setModal}>
          <DialogContent>
              <DialogTitle>{detail.event.title}</DialogTitle>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="font-medium">Tanggal</p>
                  <p>{formatDate(detail.event.start)}</p>
                </div>
                <div>
                  <p className="font-medium">Jam</p>
                  <p>{formatDate(detail.event.start, 'HH:mm')} - {formatDate(detail.event.end, 'HH:mm')}</p>
                </div>
              </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}

export default SchedulePage
