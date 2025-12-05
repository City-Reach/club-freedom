import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { signInSchema } from "@/lib/schema";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { toast } from "sonner";

const inviteSignIn = signInSchema.pick({
  password: true,
});

type InviteSignIn = z.infer<typeof inviteSignIn>;

type Props = {
  invitation: Doc<"invitation">;
};

export function InviteSignInForm({ invitation }: Props) {
  const navigate = useNavigate();
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
      to: "/",
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input readOnly value={invitation.email} id="email" />
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
