"use client";

import { signupAction } from "@/actions/auth";
import { signupSchema } from "@/actions/auth/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function SignupForm() {
  const [state, formAction] = useFormState(signupAction, {
    message: "",
  });
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      ...state?.feilds,
    },
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    formAction(formData);
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <Form {...form}>
      <form
        method="post"
        ref={formRef}
       // action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Create Admin</CardTitle>
            <CardDescription>
              Enter your username and password below for admin user.
            </CardDescription>
            {state?.message !== "" && !state?.issues && (
              <div className="text-red-500">{state?.message}</div>
            )}
            {state?.issues && (
              <div className="text-red-500">
                <ul className="grid gap-1">
                  {state.issues.map((issue) => (
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Admin
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
