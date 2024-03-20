"use client"

import { useEffect, useState } from "react";
import UserForm, { IBodyUser } from "@/components/page/user/form";
import supabase from "@/config/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface IUser {
  id: string;
  name: string;
  created_at: string;
}

const UserEdit = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [item, setItem] = useState<IUser>()
  const [isLoading, setIsLoading] = useState(true)

  const onSubmit = async (data: IBodyUser) => {
    setIsLoading(true)
    const {error} = await supabase
      .from("users")
      .update([{ name: data.name }])
      .eq('id', params.id)
      .select()
    if(error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching users: " + error.message,
      });
      setIsLoading(false)
    } else {
      router.push("/user");
    }
  };

  const fetchItem = async () => {
    const {data, error} = await supabase
      .from("users")
      .select()
      .eq('id', params.id)
    if (error) throw error
    if (data) setItem(data[0])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return <UserForm item={item} isLoading={isLoading} submit={onSubmit} />;
};

export default UserEdit;
