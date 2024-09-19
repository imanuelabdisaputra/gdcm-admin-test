"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Menu, Users, Calendar, Notebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/assets/logo.png";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
  isMobile?: boolean;
  isSmall?: boolean;
}

interface IMenu {
  title: string;
  to: string;
  icon: any;
}

const menus: IMenu[] = [
  {
    title: "Jemaat",
    to: "/user",
    icon: Users
  },
  {
    title: "Attendance",
    to: "/attendance",
    icon: Notebook
  },
  {
    title: "Schedule",
    to: "/schedule",
    icon: Calendar
  },
  {
    title: "Leader",
    to: "/leader",
    icon: User
  }
];

const MenuComponent = ({ isMobile, isSmall }: IProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [isActive, setIsActive] = useState(false);

  const onClickMenu = (val: IMenu) => {
    router.push(val.to);
    setOpen(false);
  };

  return isMobile ? (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col"
      >
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Image
              src={Logo}
              alt=""
              width={32}
              height={32}
            />
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
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  ) : (
    <nav className="relative grid items-start space-y-1 px-2 text-sm font-medium lg:px-4">
      {menus.map((item, i) => (
        <div key={i}>
          <Link
            href={item.to}
            className={`relative flex h-11 items-center justify-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
              path.includes(item.to) ? `` : ""
            }`}
          >
            {path.includes(item.to) && (
              <motion.span
                layoutId="active-pill"
                className={`absolute inset-0 h-11 rounded-lg bg-black dark:bg-slate-50`}
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <item.icon className="relative h-4 w-4 text-white mix-blend-exclusion" />
            {!isSmall && (
              <motion.span
                layoutId="text"
                className="relative flex-1 text-white mix-blend-exclusion"
              >
                {item.title}
              </motion.span>
            )}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default MenuComponent;
