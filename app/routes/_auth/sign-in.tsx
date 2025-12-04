import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_auth/sign-in")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.url().optional(),
  }),
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
