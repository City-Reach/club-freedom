import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}
