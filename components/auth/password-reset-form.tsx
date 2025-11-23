"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useNavigate } from "@tanstack/react-router";

const passwordResetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordReset = z.infer<typeof passwordResetSchema>;

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const form = useForm<PasswordReset>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(passwordResetSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: PasswordReset) => {
    await authClient.resetPassword(
      {
        token,
        newPassword: data.password,
      },
      {
        onSuccess() {
          navigate({
            to: "/sign-in",
          });
        },
        onError(context) {
          toast.error(context.error.message);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>New password</FormLabel>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Confirm password</FormLabel>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
