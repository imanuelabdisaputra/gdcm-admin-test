"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface IMenu {
  title: string;
  to: string;
}

const menus: IMenu[] = [
  {
    title: "User",
    to: "/user",
  },
  {
    title: "Attendance",
    to: "/attendance",
  },
  {
    title: "Schedule",
    to: "/schedule",
  },
];

const MenuComponent = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onClickMenu = (val: IMenu) => {
    router.push(val.to);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle className="mb-3 text-3xl">GDCM</SheetTitle>
        <div className="flex flex-col py-2 space-y-2">
          {menus.map((menu, i) => (
            <Button key={i} onClick={() => onClickMenu(menu)}>
              {menu.title}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuComponent;
