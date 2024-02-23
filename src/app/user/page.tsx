"use client";

import { useEffect, useState } from "react";
import supabase from "@/config/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface IUser {
  id: string;
  name: string;
  email: string;
}

const User = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<IUser[]>([]);

  const fetchItems = async () => {
    const { data: users, error } = await supabase.from("users").select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching users: " + error.message,
      });
    }
    if (users) setItems(users);
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting user: " + error.message,
      });
    } else {
      await fetchItems();
    }
  };

  useEffect(() => {
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return (
    <section className="container my-8 space-y-4">
      <Button onClick={() => router.push("/user/create")}>
        <Link href="/user/create">Tambah</Link>
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((d, i) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.email}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  type="button"
                  onClick={() => router.push(`/user/${d.id}`)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => onDelete(d.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default User;
