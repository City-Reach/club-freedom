import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/navbar";
import { api } from "@/convex/_generated/api";
import type { IOrg } from "@/convex/betterAuth/organizations";
import { getCurrentUser } from "../functions/auth";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    const user = await getCurrentUser();
    await queryClient.ensureQueryData(
      convexQuery(api.organizations.getAllOrgsWrapper, {}),
    );
    return { user };
  },
});

function Home() {
  const { user } = Route.useLoaderData();
  const orgsResult = useSuspenseQuery(
    convexQuery(api.organizations.getAllOrgsWrapper, {}),
  );
  const orgsData: IOrg[] = orgsResult.data;
  return (
    <>
      <Navbar user={user} />
      <main className="flex min-h-screen flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Landing Page Yippee</h1>
          <p className="mt-4 text-lg">
            Please select an org to submit testimonials to
          </p>
        </div>
      </main>
    </>
  );
}
