"use client";

import { createUserAction } from "@/actions/auth";
import { createUserSchema } from "@/actions/auth/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function CreateUserForm() {
  const [state, setState] = useState<Parameters<typeof createUserAction>[0]>(
    {
      error: false,
      message: "",
    }
  );
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      ...state?.feilds,
    },
  });

  const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("role", values.role);
    try {
      const newState = await createUserAction(state, formData);
      setPending(false);
      setState(newState);
      if (!newState.error) {
        toast.success(newState.message);
        setOpen(false);
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

  const formRef = useRef<HTMLFormElement>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Create New User</Button>
      </DialogTrigger>
      <DialogContent className="rounded sm:max-w-[425px]">
        <Form {...form}>
          <form
            autoComplete="off"
            method="post"
            // action={formAction}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <DialogHeader>
              <DialogTitle className="text-left">Create New User</DialogTitle>
              <DialogDescription className="text-left">
                Enter the username, password and select their role to create a
                new user.{" "}
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="new-password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="password"
                        {...field}
                      />
                      <button
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        type="button"
                        className="absolute right-0 top-0 h-full p-2.5"
                      >
                        {passwordVisible ? (
                          <EyeIcon className="h-full w-full" />
                        ) : (
                          <EyeOffIcon className="h-full w-full" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit" className="w-full">
                Create New User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
