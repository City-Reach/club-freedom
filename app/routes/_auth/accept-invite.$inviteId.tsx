import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InviteSignInForm } from "@/components/auth/invite-sign-in-form";
import { InviteSignUpForm } from "@/components/auth/invite-sign-up-form";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/_auth/accept-invite/$inviteId")({
  ssr: false,
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const invitation = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.findInvitationById, {
        id: params.inviteId,
      }),
    );
    if (!invitation) {
      throw notFound();
    }

    const userExists = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.checkEmailExists, { email: invitation.email }),
    );

    if (context.isAuthenticated) {
      await authClient.signOut();
    }

    return {
      invitation,
      userExists,
    };
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
