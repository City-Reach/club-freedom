import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/sign-out")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  useEffect(() => {
    authClient.signOut().then(async () => {
      await router.invalidate();
      await router.navigate({
        to: "/sign-in",
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
