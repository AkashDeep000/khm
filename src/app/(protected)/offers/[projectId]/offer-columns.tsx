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
import { deleteOfferAction } from "@/actions/offer";

export type Offer = {
  offerId: number;
  offerName: string;
  creativeName: string;
  affiliateName: string | null;
  createdAt: string;
};

export const columns: ColumnDef<Offer>[] = [
  {
    accessorKey: "offerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Offer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: function Cell({ row }) {
      return (
        <div className="max-w-44 text-wrap">{row.getValue("offerName")}</div>
      );
    },
  },
  {
    accessorKey: "offerId",
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
    accessorKey: "creativeName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creative Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: function Cell({ row }) {
      return (
        <div className="max-w-44 text-wrap">{row.getValue("creativeName")}</div>
      );
    },
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
      {
        const offer = row.original;
        const [state, setState] = useState<
          Parameters<typeof deleteOfferAction>[0]
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
                  permanently delete this offer?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    console.log(offer);

                    setPending(true);
                    try {
                      const newState = await deleteOfferAction(
                        state,
                        offer.offerId
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
                      toast.error("Error occured during offer deletation.");
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
      }
    },
  },
];
