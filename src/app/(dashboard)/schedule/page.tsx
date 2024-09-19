"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import supabase from "@/config/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner";
import formatDate from "@/lib/format";
import allLocales from "@fullcalendar/core/locales-all";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useRole } from "@/store/useRole";
import { useAuth } from "@/provider/authProvider";

const SchedulePage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState<any>();
  const { session } = useAuth();

  const header = {
    left: "prev",
    center: "title",
    right: "next"
  };
  const titleFormat: any = {
    month: "long"
  };
  const dayHeader: any = {
    weekday: "short",
    day: "numeric",
    omitCommas: true
  };

  const labelFormat: any = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };

  const fetchItems = async () => {
    try {
      const { data: schedule, error } = await supabase
        .from("schedule")
        .select();
      if (schedule) {
        const data = schedule.map((item) => {
          const date = formatDate(item.date, "yyyy-MM-dd");
          return {
            id: item.id,
            title: item.name,
            start: `${date}T${item.start_time}`,
            end: `${date}T${item.end_time}`
          };
        });
        setItems(data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching schedule: " + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const onClick = (val: any) => {
    setModal(true);
    setDetail(val);
  };

  const onDateClick = (val: any) => {
    console.log(val);
  };

  const onDelete = async () => {
    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("id", detail.event.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching schedule: " + error.message
      });
    } else {
      fetchItems();
      setModal(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Berhasil menghapus"
      });
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold">Schedule</p>
        {session && (
          <Button onClick={() => router.push("/schedule/create")}>
            Create
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={header}
            titleFormat={titleFormat}
            height="auto"
            expandRows
            dayHeaderFormat={dayHeader}
            nowIndicator
            slotDuration={{
              hours: 1
            }}
            slotLabelInterval={{
              hours: 2
            }}
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
        <Dialog
          open={modal}
          onOpenChange={setModal}
        >
          <DialogContent className="h-screen md:h-auto">
            <DialogHeader>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete()}
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </DialogHeader>

            <DialogTitle>{detail.event.title}</DialogTitle>
            <p className="mt-2">
              {formatDate(detail.event.start, "eeee, dd MMMM")} ⋅{" "}
              {formatDate(detail.event.start, "HH:mm")} -{" "}
              {formatDate(detail.event.end, "HH:mm")}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};

export default SchedulePage;
