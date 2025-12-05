import AuthLayout from "@/components/layouts/auth-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";
import { convexQuery } from "@convex-dev/react-query";
import { Button } from "@react-email/components";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/invite/$invitationId")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
  loader: async ({ context, params }) => {
    const invitation = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.findInvitationById, {
        id: params.invitationId,
      }),
    );
    if (!invitation) {
      throw notFound();
    }
    return {
      invitation,
    };
  },
});

function RouteComponent() {
  const { invitation } = Route.useLoaderData();
  const router = useRouter();

  const acceptInvitation = async () => {
    const { data } = await authClient.organization.acceptInvitation({
      invitationId: invitation._id,
    });

    if (data) {
      await router.navigate({
        to: "/o/$slug",
        params: { slug: invitation.organization.slug },
      });
      return;
    }

    await authClient.signOut();
    await router.invalidate();
    await router.navigate({
      to: "/accept-invite/$invitationId",
      params: { invitationId: invitation._id },
    });
  };

  useEffect(() => {
    acceptInvitation();
  }, []);

  return (
    <AuthLayout>
      <Card>
        <CardContent className="flex flex-col items-center gap-2">
          <Spinner className="size-4" />
          <span>Getting invitation info</span>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

function NotFoundComponent() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Invitation not found</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button>Go Home</Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
