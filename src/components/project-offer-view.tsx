"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Offer } from "./offer";
import { DatabaseOffer, DatabaseProject } from "@/db";
import { Button } from "./ui/button";
import { ClipboardCopy, Loader2, MoreHorizontal, Trash } from "lucide-react";
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
import { CreateProjectForm } from "./create-project";
import { Affiliate } from "@/utils/fetchAffiliates";

interface Project extends DatabaseProject {
  offers: DatabaseOffer[];
}

export function ProjectOfferView({
  projects,
  affiliates,
}: {
  projects: Project[];
  affiliates: Affiliate[];
}) {
  const [state, setState] = useState<Parameters<typeof deleteProjectAction>[0]>(
    {
      error: false,
      message: "",
    }
  );
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Accordion type="single" collapsible className="w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Active Offers by Project</h3>
        <CreateProjectForm affiliates={affiliates} />
      </div>
      {projects.length === 0 && (
        <div className="p-4 w-full border border-dashed mt-2 text-center">
          No project found
        </div>
      )}
      {projects.map((project) => (
        <AccordionItem key={project.projectId} value={project.projectId}>
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              {isClient && (
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open project option</span>
                        {pending ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
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
                        permanently delete this project and corresponding
                        offers?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        disabled={pending}
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
                            toast.error(
                              "Error occured during project deletation."
                            );
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
              )}
               {project.projectId}
               <span className="text-sm font-normal">({project.affiliateName})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border rounded-lg pb-0 mb-4">
            {project.offers.length === 0 && (
              <div className="p-4 w-full text-center">No offer found</div>
            )}
            {project.offers.map((offer, i) => (
              <Offer
                className={i !== project.offers.length - 1 ? "border-b" : ""}
                offer={offer}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
