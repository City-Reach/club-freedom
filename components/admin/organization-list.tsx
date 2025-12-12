import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Link } from "@tanstack/react-router";

export default function OrganizationList() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.list();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 items-center p-4">
        <Spinner />
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-3 text-destructive p-4">
        <AlertCircle />
        <span>{error?.message || "An error occurred"}</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 bg-muted rounded-md">
        No organizations
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((organization) => (
        <Card key={organization.id} className="py-4">
          <CardHeader>
            <CardTitle>
              <Link
                to="/o/$orgSlug/testimonials"
                params={{ orgSlug: organization.slug }}
                className="hover:underline hover:underline-offset-2"
              >
                {organization.name}
              </Link>
            </CardTitle>
            <CardDescription>{organization.slug}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
