import ResetPasswordForm from "@/components/auth/password-reset-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reset-password")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      token: search.token as string,
    };
  },
});

function RouteComponent() {
  const { token } = Route.useSearch();

  if (!token) {
    return (
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Invalid Reset Password Link</CardTitle>
        </CardHeader>
        <CardContent>
          The password reset link is invalid or has expired.
        </CardContent>
        <CardFooter className="inline">
          <CardDescription>
            Please request a new password reset link{" "}
            <Link
              className="text-foreground underline-offset-4 hover:underline"
              to="/forgot-password"
            >
              here
            </Link>
            .
          </CardDescription>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
