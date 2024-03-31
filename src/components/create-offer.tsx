"use client";

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
import { Check, ChevronsUpDown } from "lucide-react";
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
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { Offer } from "@/utils/fetchOffers";
import { createOfferSchema } from "@/actions/offer/schema";
import { Creative } from "@/utils/fetchCreatives";
import { getCreativesAction } from "@/actions/creative";
import { createOfferAction } from "@/actions/offer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CreateOfferForm({
  projects,
  offers,
}: {
  offers: Offer[];
  projects: {
    projectId: string;
  }[];
}) {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [openP1, setOpenP1] = useState(false);
  const [openP2, setOpenP2] = useState(false);
  const [openP3, setOpenP3] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [formState, setFormState] = useState<
    Parameters<typeof createOfferAction>[0]
  >({
    error: false,
    message: "",
  });

  const [pending, setPending] = useState(false);
  const [creativeFetchPending, setCreativeFetchPending] = useState(false);

  const form = useForm<z.infer<typeof createOfferSchema>>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      projectId: "",
      offerId: undefined,
      offerName: "",
      creativeId: undefined,
      creativeName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createOfferSchema>) => {
    setPending(true);
    const formData = new FormData();
    formData.append("projectId", values.projectId);
    formData.append("offerId", values.offerId.toString());
    formData.append("offerName", values.offerName);
    formData.append("creativeId", values.creativeId.toString());
    formData.append("creativeName", values.creativeName);
    try {
      const newState = await createOfferAction(formState, formData);
      setPending(false);
      setFormState(newState);
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
      <Form {...form}>
        <form
          onChange={() =>
            setFormState({
              error: false,
              message: "",
            })
          }
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Create Offer</CardTitle>
              <CardDescription>
                Create Offer by selecting the feids bellow
              </CardDescription>
              {formState?.message !== "" && !formState?.issues && (
                <div
                  className={`pt-2 ${
                    formState.error ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formState?.message}
                </div>
              )}
              {formState?.issues && (
                <div className="pt-2 text-red-500">
                  <ul className="grid gap-1">
                    {formState.issues.map((issue) => (
                      <li className="list-disc ml-4" key={issue}>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Project</FormLabel>
                    <Popover
                      open={openP1}
                      onOpenChange={setOpenP1}
                      modal={true}
                    >
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
                              ? projects.find(
                                  (project) => project.projectId === field.value
                                )?.projectId
                              : "Select Project"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search creative..." />
                          <CommandEmpty>
                            No Project found.{" "}
                            {projects.length === 0 ? (
                              <>
                                <br /> First create a project.
                              </>
                            ) : null}{" "}
                          </CommandEmpty>
                          <CommandList>
                            <ScrollArea className="h-48">
                              <CommandGroup>
                                {projects.map((project, i) => (
                                  <CommandItem
                                    value={project.projectId}
                                    key={i.toString() + project.projectId}
                                    onSelect={() => {
                                      setFormState({
                                        error: false,
                                        message: "",
                                      });
                                      form.clearErrors("projectId");
                                      form.setValue(
                                        "projectId",
                                        project.projectId
                                      );
                                      setOpenP1(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        project.projectId === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {project.projectId}
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
              <FormField
                control={form.control}
                name="offerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Affilate</FormLabel>
                    <Popover
                      open={openP2}
                      onOpenChange={setOpenP2}
                      modal={true}
                    >
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
                              ? offers.find(
                                  (offer) => offer.offerId === field.value
                                )?.offerName
                              : "Select offer"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search offer..." />
                          <CommandEmpty>No offer found.</CommandEmpty>
                          <CommandList>
                            <ScrollArea className="h-48">
                              <CommandGroup>
                                {offers.map((offer, i) => (
                                  <CommandItem
                                    value={offer.offerName}
                                    key={
                                      i.toString() + offer.offerId.toString()
                                    }
                                    onSelect={async () => {
                                      setCreatives([]);
                                      setFormState({
                                        error: false,
                                        message: "",
                                      });
                                      form.clearErrors("offerId");
                                      form.setValue("offerId", offer.offerId);
                                      form.setValue(
                                        "offerName",
                                        offer.offerName
                                      );
                                      form.resetField("creativeId");
                                      form.resetField("creativeName");
                                      setOpenP2(false);
                                      try {
                                        setCreativeFetchPending(true);
                                        const creativesRes =
                                          await getCreativesAction(
                                            offer.offerId
                                          );
                                        setCreativeFetchPending(false);
                                        if (
                                          !creativesRes.error &&
                                          creativesRes.data
                                        ) {
                                          setCreatives(creativesRes.data);
                                          toast.success("Loaded Creatives");
                                        } else {
                                          toast.error(creativesRes.message);
                                        }
                                      } catch (error) {
                                        console.log(error);
                                        toast.error(
                                          "Error occured during project creation."
                                        );
                                        setCreativeFetchPending(false);
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        offer.offerId === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {offer.offerName}
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
              <FormField
                control={form.control}
                name="creativeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Creative</FormLabel>
                    <Popover
                      open={openP3}
                      onOpenChange={setOpenP3}
                      modal={true}
                    >
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
                              ? creatives.find(
                                  (creative) =>
                                    creative.creativeId === field.value
                                )?.creativeName
                              : "Select creative"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search creative..." />
                          <CommandEmpty>No creative found.</CommandEmpty>
                          <CommandList>
                            <ScrollArea className="h-48">
                              <CommandGroup>
                                {creatives.map((creative, i) => (
                                  <CommandItem
                                    value={creative.creativeName}
                                    key={
                                      i.toString() +
                                      creative.creativeId.toString()
                                    }
                                    onSelect={() => {
                                      setFormState({
                                        error: false,
                                        message: "",
                                      });
                                      form.clearErrors("creativeId");
                                      form.setValue(
                                        "creativeId",
                                        creative.creativeId
                                      );
                                      form.setValue(
                                        "creativeName",
                                        creative.creativeName
                                      );
                                      setOpenP3(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        creative.creativeId === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {creative.creativeName}
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
            </CardContent>
            <CardFooter>
              <Button disabled={pending} className="w-full" type="submit">
                Create Offer
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
