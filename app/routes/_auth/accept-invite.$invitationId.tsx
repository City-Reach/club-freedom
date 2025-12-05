import { InviteSignInForm } from "@/components/auth/invite-sign-in-form";
import { InviteSignUpForm } from "@/components/auth/invite-sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/accept-invite/$invitationId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const invitation = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.findInvitationById, {
        id: params.invitationId,
      })
    );
    if (!invitation) {
      throw notFound();
    }
    const userExists = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.checkEmailExists, { email: invitation.email })
    );
    return { invitation, userExists };
  },
});

function RouteComponent() {
  const { invitation, userExists } = Route.useLoaderData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Accept invite</CardTitle>
        <CardDescription>
          You're about to join <strong>{invitation.organization.name}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userExists ? <InviteSignInForm /> : <InviteSignUpForm />}
      </CardContent>
    </Card>
  );
}
