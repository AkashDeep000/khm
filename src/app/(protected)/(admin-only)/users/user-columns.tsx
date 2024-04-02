"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash, MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { deleteUserAction } from "@/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type User = {
  username: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: function Cell({ row }) {
      const password = row.getValue("password") as ReactNode;
      const [show, setShow] = useState(false);

      return (
        <div
          onClick={() => setShow(!show)}
          className="max-w-36 text-center, text-wrap"
        >
          {show
            ? password
            : Array(password?.toString().length).fill("*").join("")}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: function Cell({ row }) {
      const [isClient, setIsClient] = useState(false);
      useEffect(() => {
        setIsClient(true);
      }, []);
      if (!isClient) {
        return <div className="animate-pulse h-4 mx-2 bg-accent"></div>;
      }
      const createdAt = row.getValue("createdAt") as string;
      const date = new Date(
        createdAt.split(" ").join("T") + "Z"
      ).toLocaleString();
      return <span>{date}</span>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const user = row.original;
      const [state, setState] = useState<
        Parameters<typeof deleteUserAction>[0]
      >({
        error: false,
        message: "",
      });
      const [pending, setPending] = useState(false);
      const [deleteOpen, setDeleteOpen] = useState(false);

      return (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open user actions</span>
                {pending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="w-full text-destructive focus:text-destructive hover:text-destructive">
                  <Trash className="h-4 w-4" />
                  <span className="pl-2">Remove</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
            <Toaster richColors />
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this project and corresponding offers?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  try {
                    const newState = await deleteUserAction(
                      state,
                      user.username
                    );
                    setPending(false);
                    setDeleteOpen(false);
                    setState(newState);
                    if (!newState.error) {
                      toast.success(newState.message);
                    } else {
                      toast.error(newState.message);
                    }
                  } catch (error) {
                    setDeleteOpen(false);
                    console.log(error);
                    toast.error("Error occured during user deletation.");
                    setPending(false);
                  }
                }}
                type="submit"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
