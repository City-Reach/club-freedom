"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Link, useNavigate } from "@tanstack/react-router";

type SignIn = z.infer<typeof signInSchema>;

export function SignInForm() {
  const navigate = useNavigate();

  const form = useForm<SignIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignIn) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess() {
          navigate({ to: "/testimonials" });
        },
        onError(ctx) {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
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
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  to="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
