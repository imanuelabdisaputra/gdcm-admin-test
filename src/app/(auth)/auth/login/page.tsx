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
import { FormSchema, FormSchemaPhone } from "./types"
import Google from '@/assets/google-logo.png'
import Facebook from '@/assets/facebook-logo.png'
import Image from "next/image"

export interface IForm {
  email?: string
  password?: string
  phone?: string
}

const LoginForm = () => {
  const router = useRouter()
  const { setProfile } = useProfile()
  const [loginWithPhone, setLoginWithPhone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: zodResolver(loginWithPhone ? FormSchemaPhone : FormSchema),
  })

  function formatPhoneNumber(phoneNumber: string) {
    if (phoneNumber.startsWith("+62")) {
      return phoneNumber
    } else {
      return phoneNumber.replace(/^0/, "+62")
    }
  }

  const onSubmit: SubmitHandler<IForm> = async (val) => {
    setIsLoading(true)
    let error
    let data
    if (loginWithPhone) {
      const res = await supabase.auth.signInWithOtp({
        phone: formatPhoneNumber(val.phone ?? ""),
      })
      error = res.error
      data = res.data
    } else {
      const res = await supabase.auth.signInWithPassword({
        email: val.email ?? "",
        password: val.password ?? "",
      })
      error = res.error
      data = res.data
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
      setIsLoading(false)
    }
    if (data) {
      loginWithPhone
        ? (
          localStorage.setItem('phone', getValues('phone') ?? ''),
          router.push("/auth/otp")
        )
        : (setProfile(data), router.push("/"))
    }
  }

  const loginWithProvider = async (provider: 'google' | 'facebook') => {
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
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

  const onLoginWithPhone = () => {
    setLoginWithPhone(!loginWithPhone)
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
          {loginWithPhone ? (
            <Input
              {...register("phone")}
              label="Phone"
              type="phone"
              required
              error={errors.phone}
            />
          ) : (
            <>
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
            </>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            Sign in
          </Button>
          <div className="w-full h-px bg-slate-200" />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onLoginWithPhone}
          >
            Sign in with {loginWithPhone ? "Email" : "Phone"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => loginWithProvider('google')}
          >
            <Image src={Google} alt="google logo" height={16} width={16} />
            Sign in with Google
          </Button>
          <Button
            type="button"
            variant="facebook"
            className="w-full"
            onClick={() => loginWithProvider('facebook')}
          >
            <Image src={Facebook} alt="google logo" height={16} width={16} />
            Sign in with Facebook
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default LoginForm
