"use client";

import { loginAction } from "@/actions/auth";
import { loginSchema } from "@/actions/auth/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [state, setState] = useState<Parameters<typeof loginAction>[0]>({
    error: false,
    message: "",
  });
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      ...state?.feilds,
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    setPending(true)
    try {
      const newState = await loginAction(state, formData);
      setPending(false);
      setState(newState);
      if (newState?.error) {
        toast.error(newState.message);
      }
      toast.success('Login successfull')
    } catch (error) {
      console.log(error);
      toast.error("Error occured during login.");
      setPending(false);
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <Form {...form}>
      <form
        onChange={() =>
          setState({
            error: false,
            message: "",
          })
        }
        method="post"
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username and password below to login to your account.
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
            <Button disabled={pending} type="submit" className="w-full">
            <p className="flex gap-2 items-center">{pending ? <>Logging in... <Loader2 className="w-4 h-4 animate-spin"/></> : "Login"}</p>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
