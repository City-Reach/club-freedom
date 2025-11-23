import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/create-user")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useQuery(api.auth.getCurrentUser);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name: `${firstName} ${lastName}`,
        // custom field configured via user.additionalFields in
        // convex/auth.ts
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
        },
        onError: async (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      }
    );
  };
  if (user === undefined) {
    return <div>Loading...</div>;
  }
  if (user === null || user.role !== "admin") {
    //For devs to access this page without the admin role, comment out this condition
    return <>Forbidden</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Create Account</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm Password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={handleSignUp}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Create an account"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
