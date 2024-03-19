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
import { useRouter } from "next/navigation";
import format from "@/lib/format"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

interface IItems {
  id: string;
  name: string;
  date: string;
}

const User = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<IItems[]>([]);
  const [rowSelection, setRowSelection] = useState({})

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
      accessorKey: "date",
      header: "Tanggal",
      cell: ({ row }) => (
        <div className="capitalize">
          {format(row.getValue("date"), 'PPP')}
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
              <DropdownMenuItem onClick={() => onDelete(row.original.date)}>
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
    const { data: users, error } = await supabase.from("attendance").select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching users: " + error.message,
      });
    }
    if (users) {
      const seenDates = new Set(); // Efficiently store seen dates
      const filteredData = users.filter((item) => {
        const dateString = item.date; // Extract date string
        if (!seenDates.has(dateString)) {
          seenDates.add(dateString); // Add unique date to the set
          return true; // Keep the item
        }
        return false; // Exclude duplicates
      });
      const data = filteredData.map(item => ({
        ...item,
      }))
      setItems(data)
    };
  };

  const onDelete = async (date: string) => {
    const d = format(date, 'yyyy-MM-dd')
    const { error } = await supabase.from("attendance").delete().eq("date", d);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting attendance: " + error.message,
      });
    } else {
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully delete attendance",
      });
      await fetchItems();
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="container my-8 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Absensi</h1>
        <Button onClick={() => router.push("/attendance/create")}>
          Tambah
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
                onClick={() => router.push(`/attendance/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default User;
