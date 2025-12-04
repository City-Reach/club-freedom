import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/betterAuth/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const invitation = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.findInvitationById, {
        id: params.id as Id<"invitation">,
      }),
    );
    if (!invitation) {
      throw notFound();
    }
    return { invitation };
  },
});

function RouteComponent() {
  const { invitation } = Route.useLoaderData();
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  );
}
