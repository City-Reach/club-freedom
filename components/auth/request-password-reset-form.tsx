"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/schema";
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

const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

type RequestPasswordReset = z.infer<typeof requestPasswordResetSchema>;

export function RequestPasswordResetForm() {
  const form = useForm<RequestPasswordReset>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordReset) => {
    try {
      await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${import.meta.env.VITE_SITE_URL}/reset-password`,
      });
      toast.success("Check your email for the reset password link!");
    } catch (err) {
      toast.error("Password reset request failed. Please try again.");
    }
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
        <Button type="submit">Request password reset</Button>
      </form>
    </Form>
  );
}
