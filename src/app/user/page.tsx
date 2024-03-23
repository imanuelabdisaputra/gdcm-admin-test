"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import supabase from "@/config/supabaseClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableLoading,
  TableEmpty,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";

interface IUser {
  id: string;
  name: string;
  email: string;
}

const User = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<IUser[]>([]);
  const [rowSelection, setRowSelection] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const columns: ColumnDef<any>[] = [
    {
      id: "no",
      header: 'No',
      cell: ({ row }) => (
        <p>{row.index + 1}</p>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div className="capitalize" onClick={() => router.push(`/user/${row.original.id}`)}>
          {row.getValue("name")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <DotsVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const fetchItems = async () => {
    const { data: users, error } = await supabase.from("users").select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching users: " + error.message,
      });
    }
    if (users) {
      setItems(users)
    };
    setIsLoading(false)
  };

  const onDelete = async (id: string) => {
    setIsLoading(true)
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
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Jemaat</h1>
        <Button disabled={isLoading} onClick={() => router.push("/user/create")}>
          <Link href="/user/create">Tambah</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isLoading ? (
            <TableLoading colSpan={columns.length} />
          ) : (
            <TableEmpty colSpan={columns.length} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default User;
