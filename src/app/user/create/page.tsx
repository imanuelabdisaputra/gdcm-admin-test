"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import supabase from "@/config/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Inputs = {
  name: string;
  email: string;
};

const User = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await supabase
      .from("users")
      .insert([{ name: data.name, email: data.email }])
      .select();
    router.push("/user");
  };

  return (
    <section className="container my-8">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Tambah User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                {...register("name", { required: true })}
                label="Nama"
                placeholder="Nama"
                errorMessage={errors.name && "This field is required"}
              />
              <Input
                {...register("email", { required: true })}
                label="Email"
                placeholder="Email"
                errorMessage={errors.email && "This field is required"}
              />

              <div className="flex justify-between">
                <Button type="submit">Submit</Button>
                <Button
                  variant={"secondary"}
                  onClick={() => router.push("/user")}
                >
                  Back
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default User;
