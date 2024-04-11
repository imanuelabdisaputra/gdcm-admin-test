"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter, useSearchParams } from "next/navigation"
import { useProfile } from "@/store/useProfile"
import { useAuth } from "@/store/useAuth"
import { FormSchema } from './types'

export interface IForm {
  password: string
  confirmPassword: string
}

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const { setProfile } = useProfile()
  const { logout } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: zodResolver(FormSchema)
  })

  const onSubmit: SubmitHandler<IForm> = async (val) => {
    setIsLoading(true)
    const query = params.get('email')
    const { data, error } = await supabase.auth.updateUser({
      email: String(query),
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
      logout(router)
      router.push("/")
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Input
            {...register("password", { required: true })}
            label="New Password"
            type="password"
            required
            error={errors.password}
          />
          <Input
            {...register("confirmPassword", { required: true })}
            label="Confirm Password"
            type="password"
            required
            error={errors.confirmPassword}
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

export default ResetPasswordForm
