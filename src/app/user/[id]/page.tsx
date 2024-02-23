"use client"

import { useEffect, useState } from "react";
import UserForm, { IBodyUser } from "@/components/page/user/form";
import supabase from "@/config/supabaseClient";
import { useRouter } from "next/navigation";

interface IUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const UserEdit = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [item, setItem] = useState<IUser>()

  const onSubmit = async (data: IBodyUser) => {
    const {error} = await supabase
      .from("users")
      .update([{ name: data.name, email: data.email }])
      .eq('id', params.id)
      .select()
    if(error) {
      throw error
    } else {
      router.push("/user");
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      const {data, error} = await supabase
        .from("users")
        .select()
        .eq('id', params.id)
      if (error) throw error
      if (data) setItem(data[0])
    }
  
    fetchItem();
  }, [params.id])
  

  return <UserForm item={item} submit={onSubmit} />;
};

export default UserEdit;
