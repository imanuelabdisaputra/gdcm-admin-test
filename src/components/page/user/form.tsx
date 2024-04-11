"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type IBodyUser = {
  name?: string;
};

type UserProps = {
  submit: (data: IBodyUser) => void;
  item?: IBodyUser;
  isLoading?: boolean
};

const User = ({ submit, item, isLoading }: UserProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IBodyUser>();

  const onSubmit: SubmitHandler<IBodyUser> = async (data) => {
    submit(data);
  };

  useEffect(() => {
    setValue("name", item?.name);
  }, [item?.name, setValue]);

  return (
    <Card className="max-w-[350px] mx-auto">
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
              error={errors.name}
            />

            <div className="flex justify-between">
              <Button type="submit" disabled={isLoading}>Submit</Button>
              <Button
                type="button"
                variant={"secondary"}
                disabled={isLoading}
                onClick={() => router.push("/user")}
              >
                Back
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default User;
