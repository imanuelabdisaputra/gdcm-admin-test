"use client"

import { useEffect, useState } from "react"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import supabase from "@/config/supabaseClient"
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/store/useProfile"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

const Otp = () => {
  const router = useRouter()
  const { setProfile } = useProfile()
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState<string>()
  const { toast } = useToast();
  const [phone, setPhone] = useState<string>('')

  function formatPhoneNumber(phoneNumber: string) {
    if (phoneNumber.startsWith("+62")) {
      return phoneNumber
    } else {
      return phoneNumber.replace(/^0/, "+62")
    }
  }

  const onVerify = async () => {
    setIsLoading(true)
    let { data, error } = await supabase.auth.verifyOtp({
      phone: formatPhoneNumber(phone),
      token: otp ?? "",
      type: "sms",
    })
    if (data.user) {
      setProfile(data)
      localStorage.removeItem('phone')
      router.push("/")
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPhone(String(localStorage.getItem("phone")))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Please Check Your Message</CardTitle>
        <CardDescription>We`ve send code to {phone}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          onChange={(val) => setOtp(val)}
        >
          {Array(6)
            .fill({})
            .map((_, i) => (
              <InputOTPGroup key={i}>
                <InputOTPSlot index={i} />
              </InputOTPGroup>
            ))}
        </InputOTP>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={isLoading || otp?.length !== 6} onClick={onVerify}>
          Verify
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Otp
