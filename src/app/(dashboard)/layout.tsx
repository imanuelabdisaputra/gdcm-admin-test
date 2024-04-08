"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import "../globals.css"

import { CircleUser } from "lucide-react"

import { Toaster } from "@/components/ui/toaster"
import MenuComponent from "@/components/page/layout/menu"
import Logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import supabase from "@/config/supabaseClient"
import { toast } from "@/components/ui/use-toast"
import { useProfile } from "@/store/useProfile"
import { useAuth } from "@/store/useAuth"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const { setProfile } = useProfile()
  const { logout } = useAuth()

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
      router.push("/auth/login")
    }
    if (user) {
      setProfile(user)
      router.push("/user")
    }
  }

  useEffect(() => {
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex flex-col h-full max-h-screen gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image src={Logo} alt="" width={32} height={32} />
                <span className="">GDCM</span>
              </Link>
            </div>
            <div className="flex-1">
              <MenuComponent />
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between md:justify-end">
            <MenuComponent isMobile />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="w-5 h-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout(router)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="relative flex flex-col flex-1 gap-4 overflow-scroll lg:gap-6">
            <section className="p-4 sm:container sm:py-6">{children}</section>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  )
}
