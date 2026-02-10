import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { passwordResetSchema } from "./password-reset-form";

const inviteSignUp = z.intersection(
  passwordResetSchema,
  z.object({
    name: z
      .string()
      .min(2, { error: "Name must be at least 2 characters long" }),
  }),
);

type InviteSignUp = z.infer<typeof inviteSignUp>;

export function InviteSignUpForm() {
  const navigate = useNavigate();
  const { invitation } = useLoaderData({
    from: "/_auth/accept-invite/$inviteId",
  });
  const form = useForm<InviteSignUp>({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(inviteSignUp),
  });

  const onSubmit = async (data: InviteSignUp) => {
    const newUser = await authClient.signUp.email(
      {
        name: data.name,
        password: data.password,
        email: invitation.email,
      },
      {
        headers: {
          "x-invitation-id": invitation._id,
        },
      },
    );

    if (newUser.error) {
      toast.error("Cannot create new user", {
        description: newUser.error.message,
      });
      return;
    }

    const acceptInvite = await authClient.organization.acceptInvitation({
      invitationId: invitation._id,
    });

    if (acceptInvite.error) {
      toast.error("Cannot accept invitation", {
        description: acceptInvite.error.message,
      });
      return;
    }

    toast.success("Invitation accepted");
    await navigate({
      to: "/o/$orgSlug",
      params: {
        orgSlug: invitation.organization.slug,
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          readOnly
          className="read-only:bg-muted"
          value={invitation.email}
          id="email"
        />
      </Field>
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              type="password"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
            <Input
              {...field}
              type="password"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Spinner /> : "Accept invite"}
      </Button>
    </form>
  );
}
