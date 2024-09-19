"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../globals.css";
import { motion } from "framer-motion";

import { CircleUser } from "lucide-react";

import { Toaster } from "@/components/ui/toaster";
import MenuComponent from "@/components/page/layout/menu";
import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/useAuth";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { logout } = useAuth();
  const [hide, setHide] = useState(true);

  return (
    <>
      <div className="flex h-screen w-full pl-[84px]">
        <motion.div
          whileHover={{ width: "100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          onHoverStart={() => setHide(false)}
          onHoverEnd={() => setHide(true)}
          className="absolute inset-0 z-10 hidden w-[84px] border-r bg-white dark:bg-black md:block md:max-w-56 xl:max-w-72"
        >
          <div className="relative flex h-full max-h-screen flex-col gap-2">
            <div
              className={`relative flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6`}
            >
              <div className="overflow-hidden">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Image
                    src={Logo}
                    alt="Logo GD"
                    height={35}
                    width={35}
                  />
                </Link>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <MenuComponent isSmall={hide} />
            </div>
          </div>
        </motion.div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 md:justify-end lg:h-[60px] lg:px-6">
            <MenuComponent isMobile />
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout(router)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="relative flex flex-1 flex-col gap-4 overflow-scroll lg:gap-6">
            <section className="flex flex-1 flex-col p-4 sm:container sm:py-6">
              {children}
            </section>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}
