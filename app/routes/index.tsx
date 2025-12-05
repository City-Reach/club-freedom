import { createFileRoute } from "@tanstack/react-router";
import TestonomialForm from "@/components/forms/testinomial-form";
import Navbar from "@/components/navbar";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser, {}),
    );
    return { user };
  },
});

function Home() {
  const { user } = Route.useLoaderData();
  return (
    <>
      <Navbar user={user} />
      <main className="flex min-h-screen flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-secondary">Club Freedom</span>{" "}
            Testimonial
          </h1>
          <p className="mt-4 text-lg">Please share your testimonial with us!</p>
          <p className="mt-4 italic text-lg text-gray-600">
            "Let your light shine before others" – Matthew 5:16
          </p>
        </div>
        <TestonomialForm />
      </main>
    </>
  );
}
