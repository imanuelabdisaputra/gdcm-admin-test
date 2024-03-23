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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/datePicker";

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
  const [date, setDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("name")}
        </div>
      ),
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
      setIsLoading(false)
    };
  };

  const onSelect = async () => {
    setIsLoading(true)
    const selected = table.getFilteredSelectedRowModel()
    const names = selected.rows.map(item => item.original.id)
    const d = {
      date: date,
      names: names || []
    }
    const { error, data: attendance } = await supabase
    .from('attendance')
    .insert(d)
    .select()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error create attendance: " + error.message,
      });
      setIsLoading(false)
    }
    if (attendance) {
      router.push("/attendance");
    }
  }

  const onSubmitAttendance = async (val: Date) => {
    setDate(val);
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Buat Absensi</h1>
        <Button disabled={isLoading} onClick={onSelect}>Simpan</Button>
      </div>

      <DatePicker submit={onSubmitAttendance} />

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
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button disabled={isLoading} onClick={() => router.push('/attendance')}>Back</Button>
    </div>
  );
};

export default User;
