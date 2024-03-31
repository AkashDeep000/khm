"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ClipboardCopy,
  DeleteIcon,
  InspectionPanel,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
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
import { deleteProjectAction } from "@/actions/project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export type Project = {
  projectId: string;
  affiliateId: number;
  affiliateName: string;
  createdAt: string;
  offerCount: number;
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "projectId",
    header: "Project ID",
  },
  {
    accessorKey: "affiliateName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Affiliate Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "offerCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Offer Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-4">{row.getValue("offerCount")}</div>,
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
    cell: ({ row }) => {
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
    cell: ({ row }) => {
      const project = row.original;
      const [state, setState] = useState<
        Parameters<typeof deleteProjectAction>[0]
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
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(project.projectId);
                  toast.success("Copied the Project ID");
                }}
              >
                <ClipboardCopy className="h-4 w-4" />
                <span className="pl-2">Copy project ID</span>
              </DropdownMenuItem>
              <Link href={`./offers/${project.projectId}`}>
                {" "}
                <DropdownMenuItem>
                  <InspectionPanel className="h-4 w-4" />
                  <span className="pl-2">View Offers</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="w-full text-destructive focus:text-destructive hover:text-destructive">
                  <DeleteIcon className="h-4 w-4" />
                  <span className="pl-2">Delete</span>
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
                onClick={async () => {
                  setPending(true);
                  try {
                    const newState = await deleteProjectAction(
                      state,
                      project.projectId
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
                    toast.error("Error occured during project deletation.");
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
