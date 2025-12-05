import AuthLayout from "@/components/layouts/auth-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/invite/$invitationId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const router = useRouter();

  useEffect(() => {
    authClient.signOut().then(async () => {
      await router.invalidate();
      await router.navigate({
        to: "/accept-invite/$invitationId",
        params,
      });
    });
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
