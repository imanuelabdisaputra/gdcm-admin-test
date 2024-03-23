"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import supabase from "@/config/supabaseClient";
import ScheduleFormComponent, { IScheduleItem } from "@/components/page/schedule/form";
import { toast } from "@/components/ui/use-toast";

const CreateSchedulePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: IScheduleItem) => {
    setIsLoading(true)
    const { error } = await supabase
      .from("schedule")
      .insert([{
        name: data.name,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
      }])
      .select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error submiting: " + error.message,
      });
      setIsLoading(false)
    }
    router.push("/schedule");
  };
  return (
    <ScheduleFormComponent submit={onSubmit} />
  )
}

export default CreateSchedulePage