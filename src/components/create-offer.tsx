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
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { Offer } from "@/utils/fetchOffers";
import { createOffersSchema } from "@/actions/offer/schema";
import { Creative } from "@/utils/fetchCreatives";
import { getCreativesAction } from "@/actions/creative";
import { createOffersAction } from "@/actions/offer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"

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
  const [formState, setFormState] = useState<
    Parameters<typeof createOffersAction>[0]
  >({
    error: false,
    message: "",
  });

  const [pending, setPending] = useState(false);
  const [creativeFetchPending, setCreativeFetchPending] = useState(false);

  const form = useForm<z.infer<typeof createOffersSchema>>({
    resolver: zodResolver(createOffersSchema),
    defaultValues: {
      projectIds: [],
      offerId: undefined,
      offerName: "",
      creativeId: undefined,
      creativeName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createOffersSchema>) => {
    setPending(true)
    try {
      const newState = await createOffersAction(formState, values);
      setPending(false);
      setFormState(newState);
      if (!newState.error) {
        toast.success(newState.message);
        form.reset();
        setCreatives([])
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
              <CardTitle className="text-xl">Add Offers</CardTitle>
              <CardDescription>
                Add offers by selecting the feids bellow
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
                    {formState.issues?.map((issue) => (
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
                name="offerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Offer</FormLabel>
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
                              ? `${offers.find(
                                  (offer) => offer.offerId === field.value
                                )?.offerName} (${offers.find(
                                  (offer) => offer.offerId === field.value
                                )?.offerId})`
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
                                      setOpenP1(false);
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
                                    {`${offer.offerName} (${offer.offerId})`}
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
                    <FormLabel className="flex gap-2 items-center">Select Creative {creativeFetchPending && <Loader2 className="w-4 h-4 animate-spin"/>}</FormLabel>
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
                              ? `${creatives.find(
                                  (creative) =>
                                    creative.creativeId === field.value
                                )?.creativeName} (${creatives.find(
                                  (creative) =>
                                    creative.creativeId === field.value
                                )?.creativeId})`
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
                                      setOpenP2(false);
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
                                    {`${creative.creativeName} (${creative.creativeId})`}
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
              <div className="text-sm font-semibold text-primary/90">Add to Projects</div>
              {projects.length === 0 ? <div className="text-destructive">Currently there is no project. First create a project.</div> : null}
              {projects.map((project) => (
                <FormField
                  key={project.projectId}
                  control={form.control}
                  name="projectIds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={project.projectId}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(project.projectId)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, project.projectId])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== project.projectId
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {project.projectId}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            
            </CardContent>
            <CardFooter>
              <Button disabled={pending} className="w-full" type="submit">
              <p className="flex gap-2 items-center">{pending ? <>Adding Offer/Creative... <Loader2 className="w-4 h-4 animate-spin"/></> : "Add Offer/Creative"}</p>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
