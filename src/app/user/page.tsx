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

interface IUser {
  id: string;
  name: string;
  email: string;
}

const User = () => {
  const router = useRouter()
  const [items, setItems] = useState<IUser[]>([]);

  const fetchItems = async () => {
    try {
      const { data: users, error } = await supabase.from("users").select();
      if (error) throw error;
      if (users) setItems(users);
    } catch (e: any) {
      console.error("Error fetching users:", e.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section className="container my-8 space-y-4">
      <Button onClick={() => router.push('/user/create')}>
        <Link href="/user/create">Tambah</Link>
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((d, i) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default User;
