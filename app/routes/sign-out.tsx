import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { use, useEffect } from "react";
import z from "zod";

export const Route = createFileRoute("/sign-out")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.url().optional(),
  }),
});

function RouteComponent() {
  const { redirect } = Route.useSearch();
  const router = useRouter();

  useEffect(() => {
    authClient.signOut().then(async () => {
      await router.invalidate();
      await router.navigate({
        to: redirect || "/sign-in",
      });
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <Spinner className="size-8" />
      <span>Signing out...</span>
    </div>
  );
}
