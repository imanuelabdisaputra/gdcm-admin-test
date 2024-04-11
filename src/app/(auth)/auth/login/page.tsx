"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { FormSchema } from "./types"

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
  } = useForm<IForm>({
    resolver: zodResolver(FormSchema),
  })

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

  const loginWithGoogle = async () => {
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
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
      console.log(data)
      router.push("/")
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="m@example.com"
            required
            error={errors.email}
          />
          <Input
            {...register("password")}
            label="Password"
            type="password"
            required
            error={errors.password}
          />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            Sign in
          </Button>
          <div className="w-full h-px bg-slate-200" />
          <Button
            type="button"
            variant="outline"
            disabled
            className="w-full"
            onClick={loginWithGoogle}
          >
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default LoginForm
