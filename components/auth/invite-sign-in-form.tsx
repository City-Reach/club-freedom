import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { signInSchema } from "@/lib/schema/testimonials";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";

const inviteSignIn = signInSchema.pick({
  password: true,
});

type InviteSignIn = z.infer<typeof inviteSignIn>;

export function InviteSignInForm() {
  const navigate = useNavigate();
  const { invitation } = useLoaderData({
    from: "/_auth/accept-invite/$inviteId",
  });

  const form = useForm<InviteSignIn>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(inviteSignIn),
  });

  const onSubmit = async (data: InviteSignIn) => {
    const authenticated = await authClient.signIn.email({
      email: invitation.email,
      password: data.password,
    });

    if (authenticated.error) {
      toast.error("Failed to sign in", {
        description: authenticated.error.message,
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
      params: { orgSlug: invitation.organization.slug },
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
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Link
                to="/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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
