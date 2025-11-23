import { RequestPasswordResetForm } from "@/components/auth/request-password-reset-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forget Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RequestPasswordResetForm />
      </CardContent>
    </Card>
  );
}
