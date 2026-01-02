import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  createStandardSchemaV1,
  debounce,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { Suspense } from "react";
import { Testimonials } from "@/components/testimonials";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

export const testimonialSearchParams = {
  q: parseAsString.withDefault(""),
};

export const Route = createFileRoute("/testimonials/")({
  ssr: false,
  component: TestimonialsPage,
  validateSearch: createStandardSchemaV1(testimonialSearchParams),
  loader: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
      });
    }

    const canApproveResult = await authClient.admin.hasPermission({
      permissions: {
        testimonial: ["approve"],
      },
    });

    return { canApprove: canApproveResult.data?.success || false };
  },
});

function TestimonialsPage() {
  const search = Route.useSearch();
  const { canApprove } = Route.useLoaderData();
  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
            What Our Volunteers Say
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
            Don't just take our word for it. Here's what real volunteers have to
            say about their experience.
          </p>
        </div>
      </div>
      <div className="w-full space-y-8 max-w-lg mx-auto pb-24">
        <TestimonialSearchInput />
        <Testimonials search={search.q} />
      </div>
    </main>
  );
}

function TestimonialSearchInput() {
  const [search, setSearch] = useQueryStates(testimonialSearchParams);
  return (
    <Input
      value={search.q}
      placeholder="Search testimonials"
      onChange={(e) => {
        setSearch(
          { q: e.target.value },
          {
            limitUrlUpdates: debounce(500),
          },
        );
      }}
    />
  );
}
