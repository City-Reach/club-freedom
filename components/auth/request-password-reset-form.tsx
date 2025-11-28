import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/schema";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";

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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              type="email"
              placeholder="name@example.com"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit">Request password reset</Button>
    </form>
  );
}
