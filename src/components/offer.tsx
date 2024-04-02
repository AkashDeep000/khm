"use client";

import { deleteOfferAction } from "@/actions/offer";
import { DatabaseOffer } from "@/db";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export function Offer({ offer, className }: { offer: DatabaseOffer; className: string }) {
  const [state, setState] = useState<Parameters<typeof deleteOfferAction>[0]>({
    error: false,
    message: "",
  });

  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className={cn("p-4 flex justify-between items-center gap-4", className)}>
      <div>{offer.offerName + " / " + offer.creativeName}</div>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={pending}
            variant="destructive"
            className="bg-inherit border border-destructive text-destructive hover:text-white"
          >
            {pending ? <Loader2 className="animate-spin h-5 w-5"/>  : <Trash className="h-4 w-4" />}
            <span className="pl-2">Remove</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this offer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={pending}
              onClick={async () => {
                setPending(true);
                try {
                  const newState = await deleteOfferAction(
                    state,
                    offer.id
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
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
