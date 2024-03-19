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
  selected: boolean
}

const AttendanceDetail = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<IUser[]>([]);
  // const [attendance, setAttendance] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [date, setDate] = useState<Date | undefined>()
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
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected() || row.original.selected}
            onCheckedChange={(value) => {
              console.log(row.original)
              row.toggleSelected(!!value)
              setItems(items.map(item => ({
                ...item,
                selected: item.id == row.original.id ? !!value : item.selected || false
              })))
            }}
            aria-label="Select row"
          />
        )
      },
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

  const fetchItems = async (attendance: any[]) => {
    const { data: users, error } = await supabase.from("users").select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching users: " + error.message,
      });
    }
    if (users) {
      const result = users.map(obj2 => {
        const matchingObj1 = attendance.find(obj1 => obj1.id === obj2.id);
        if (matchingObj1) {
          return { ...obj2, selected: matchingObj1.selected };
        }
        return obj2;
      });
      setItems(result)
    };
    setIsLoading(false)
  };

  const fetchAttendance = async () => {
    setIsLoading(true)
    const { data: attendance, error } = await supabase.from("attendance").select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching attendance: " + error.message,
      });
    }
    if (attendance) {
      const attendById = attendance.filter(item => item.id == params.id)[0]
      const items = attendance.filter(item => item.date == attendById.date)
      const itemMap = items.map(item => ({
        ...item,
        id: item.name,
        selected: true
      }))
      const date = itemMap[0].date
      setDate(date)
      await fetchItems(itemMap)
    };
  };

  const onSelect = async () => {
    if (!date) {
      // Handle the case when date is undefined, e.g., show an error message or set a default date
      console.error("Date is undefined");
      return;
    }
    const selected = items.filter(item => item.selected)
    const data = selected.map(item => ({
      name: item.id,
      date: date,
    }))
    const { error, data: attendance } = await supabase
    .from('attendance')
    .insert(data)
    .select()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error create attendance: " + error.message,
      });
    }
    if (attendance) {
      router.push("/attendance");
    }
  }

  const onSubmitAttendance = async (val: Date) => {
    setDate(val);
  }

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="container my-8 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Buat Absensi</h1>
        <Button onClick={onSelect}>Simpan</Button>
      </div>

      {!isLoading && (
        <DatePicker value={date} submit={onSubmitAttendance} />
      )}

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
      <Button onClick={() => router.push("/attendance")}>
        Back
      </Button>
    </section>
  );
};

export default AttendanceDetail;
