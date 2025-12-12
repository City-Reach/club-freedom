import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { api } from "@/convex/_generated/api";
import { getCurrentUser } from "../functions/auth";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    const user = await getCurrentUser();
    const organizations = await queryClient.ensureQueryData(
      convexQuery(api.organization.getAllOrganizations, {}),
    );
    return { user, organizations };
  },
});

function Home() {
  const { user, organizations } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  // const orgsResult = useSuspenseQuery(
  //   convexQuery(api.organization.getAllOrganizations, {}),
  // );
  const orgsData = organizations || [];
  const [selected, setSelected] = useState<typeof orgsData[0]| null>(null);
  return (
    <>
      <Navbar user={user} />
      <main className="flex min-h-screen flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">
            Welcome to Testimonials Submission Product!
          </h1>
          <p className="my-4 text-lg">
            Please select an org to submit testimonials to
          </p>
          <div className="flex items-center gap-3">
            <Combobox
              items={orgsData}
              valueField="slug"
              labelField="name"
              onSelect={setSelected}
              value={selected}
            />
            <Button
              disabled={!selected}
              onClick={() =>
                navigate({
                  to: "/$orgSlug",
                  params: { orgSlug: selected?.slug || "" },
                })
              }
            >
              Go
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
