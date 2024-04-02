"use client";

import { createProjectAction } from "@/actions/project";
import { createProjectSchema } from "@/actions/project/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Affiliate } from "@/utils/fetchAffiliates";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

export function CreateProjectForm({ affiliates }: { affiliates: Affiliate[] }) {
  const [openP, setOpenP] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [state, setState] = useState<Parameters<typeof createProjectAction>[0]>(
    {
      error: false,
      message: "",
    }
  );
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectId: "",
      affiliateId: undefined,
      affiliateName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createProjectSchema>) => {
    setPending(true);
    const formData = new FormData();
    formData.append("projectId", values.projectId);
    formData.append("affiliateId", values.affiliateId.toString());
    formData.append("affiliateName", values.affiliateName);
    try {
      const newState = await createProjectAction(state, formData);
      setPending(false);
      setState(newState);
      if (!newState.error) {
        toast.success(newState.message);
        setOpenD(false);
        form.reset();
      } else {
        toast.error(newState.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occured during project creation.");
      setPending(false);
    }
  };

  return (
    <>
      <Dialog
        open={openD}
        onOpenChange={(open) => {
          setOpenD(open);
          form.reset();
          setState({
            error: false,
            message: "",
          });
        }}
      >
        <DialogTrigger asChild>
          <Button>Create Project</Button>
        </DialogTrigger>
        <DialogContent className="rounded sm:max-w-[425px]">
          <Form {...form}>
            <form
              onChange={() =>
                setState({
                  error: false,
                  message: "",
                })
              }
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Enter the projectId and select the feilds to create a new
                  project.{" "}
                  {state?.message !== "" && !state?.issues && (
                    <div
                      className={`pt-2 ${
                        state.error ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {state?.message}
                    </div>
                  )}
                  {state?.issues && (
                    <div className="pt-2 text-red-500">
                      <ul className="grid gap-1">
                        {state.issues.map((issue) => (
                          <li className="list-disc ml-4" key={issue}>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project ID</FormLabel>
                    <FormDescription>
                    This is used as the <span className="bg-secondary px-1.5 py-0.5 rounded italic">project=</span> value when configuring the Iterable Data Feed. Use all lowercase and no spaces.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="projectId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="affiliateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Affilate</FormLabel>
                    <Popover open={openP} onOpenChange={setOpenP} modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? affiliates.find(
                                  (affiliate) =>
                                    affiliate.affiliateId === field.value
                                )?.affiliateName
                              : "Select affiliate"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search affiliate..." />
                          <CommandEmpty>No affiliate found.</CommandEmpty>
                          <CommandList>
                            <ScrollArea className="h-48">
                              <CommandGroup>
                                {affiliates.map((affiliate, i) => (
                                  <CommandItem
                                    value={affiliate.affiliateName}
                                    key={
                                      i.toString() +
                                      affiliate.affiliateId.toString()
                                    }
                                    onSelect={() => {
                                      form.clearErrors("affiliateId");
                                      form.setValue(
                                        "affiliateId",
                                        affiliate.affiliateId
                                      );
                                      form.setValue(
                                        "affiliateName",
                                        affiliate.affiliateName
                                      );
                                      setOpenP(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        affiliate.affiliateId === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {affiliate.affiliateName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </ScrollArea>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={pending} className="w-full" type="submit">
                <p className="flex gap-2 items-center">{pending ? <>Creating Project... <Loader2 className="w-4 h-4 animate-spin"/></> : "Create Project"}</p>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
