"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
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
  TableEmpty
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useRole } from "@/store/useRole";

interface IUser {
  id: string;
  name: string;
  email: string;
}

const User = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useRole();

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // You can adjust the limit as needed

  const columns: ColumnDef<any>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <p>{(page - 1) * limit + row.index + 1}</p>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div
          className="capitalize"
          onClick={() => router.push(`/user/${row.original.id}`)}
        >
          {row.getValue("name")}
        </div>
      )
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
              >
                <DotsVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const fetchItems = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select()
        .range((page - 1) * limit, page * limit - 1);
      if (error) throw error;
      if (users) {
        setItems(users);
      }
      setIsLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching users: " + error.message
      });
      setIsLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    setIsLoading(true);
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting user: " + error.message
      });
    } else {
      await fetchItems(page, limit);
    }
  };

  useEffect(() => {
    fetchItems(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Jemaat</h1>
        {isAdmin && (
          <Button
            disabled={isLoading}
            onClick={() => router.push("/user/create")}
          >
            <Link href="/user/create">Tambah</Link>
          </Button>
        )}
      </div>

      <div>
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
                  // data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={items.length < limit}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default User;
