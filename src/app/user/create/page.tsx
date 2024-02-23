"use client";

import supabase from "@/config/supabaseClient";
import UserForm, { IBodyUser } from "@/components/page/user/form";
import { useRouter } from "next/navigation";

const UserCreate = () => {
  const router = useRouter();

  const onSubmit = async (data: IBodyUser) => {
    await supabase
      .from("users")
      .insert([{ name: data.name, email: data.email }])
      .select();
    router.push("/user");
  };

  return (
    <UserForm item={{}} submit={onSubmit} />
  );
};

export default UserCreate;
