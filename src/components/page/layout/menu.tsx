"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { User, Menu, Users, Calendar, Notebook } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/assets/logo.png"

interface IMenu {
  title: string
  to: string
  icon: any
}

const menus: IMenu[] = [
  {
    title: "Jemaat",
    to: "/user",
    icon: Users,
  },
  {
    title: "Attendance",
    to: "/attendance",
    icon: Notebook,
  },
  {
    title: "Schedule",
    to: "/schedule",
    icon: Calendar,
  },
  {
    title: "Leader",
    to: "/leader",
    icon: User,
  },
]

const MenuComponent = ({ isMobile }: { isMobile?: boolean }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const path = usePathname()

  const onClickMenu = (val: IMenu) => {
    router.push(val.to)
    setOpen(false)
  }

  return isMobile ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Image src={Logo} alt="" width={32} height={32} />
            <span>GDCM</span>
          </Link>
          {menus.map((item, i) => (
            <Link
              key={i}
              href={item.to}
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                path.includes(item.to) ? `bg-muted !text-primary` : ""
              }`}
              onClick={() => onClickMenu(item)}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  ) : (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {menus.map((item, i) => (
        <Link
          key={i}
          href={item.to}
          className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary ${
            path.includes(item.to) ? `bg-muted !text-primary` : ""
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export default MenuComponent
