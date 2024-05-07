"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/config/supabaseClient";
import UserForm, { IBodyUser } from "@/components/page/user/form";
import { toast } from "@/components/ui/use-toast";

const UserCreate = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: IBodyUser) => {
    setIsLoading(true)
    const { error } = await supabase
      .from("users")
      .insert([{ name: data.name }])
      .select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error submiting: " + error.message,
      });
      setIsLoading(false)
    }
    router.push("/user");
  };

  return (
    <UserForm item={{}} isLoading={isLoading} submit={onSubmit} />
  );
};

export default UserCreate;
