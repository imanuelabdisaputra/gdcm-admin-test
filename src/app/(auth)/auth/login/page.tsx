"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import supabase from "@/config/supabaseClient"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useProfile } from "@/store/useProfile"

export interface IForm {
  email: string
  password: string
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setProfile } = useProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>()

  const onSubmit: SubmitHandler<IForm> = async (val) => {
    setIsLoading(true)
    let { data, error } = await supabase.auth.signInWithPassword({
      email: val.email,
      password: val.password,
    })
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
      setIsLoading(false)
    }
    if (data) {
      setProfile(data)
      router.push("/")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Input
            {...register("email", { required: true })}
            label="Email"
            type="email"
            placeholder="m@example.com"
            required
            errorMessage={errors.email && "This field is required"}
          />
          <Input
            {...register("password", { required: true })}
            label="Password"
            type="password"
            required
            errorMessage={errors.password && "This field is required"}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default LoginForm
