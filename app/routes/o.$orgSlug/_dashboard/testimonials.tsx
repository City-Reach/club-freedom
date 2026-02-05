import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Testimonials } from "@/components/testimonials";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import TestimonialFilters from "@/components/testimonial-search-query/testimonial-search-queries";
import TestimonialSearchInput from "@/components/testimonial-search-query/testimonial-search-input";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/testimonials")({
  ssr: false,
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { orgSlug } = Route.useParams();
  const { organization: preloadOrganization } = Route.useRouteContext();
  const { data: liveOrganization } = useSuspenseQuery(
    convexQuery(api.organization.getOrganizationBySlug, {
      slug: orgSlug,
    }),
  );
  const { _id } = (liveOrganization ||
    preloadOrganization) as Doc<"organization">;

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
      <div className="w-full grid gap-8 max-w-lg mx-auto mb-24 min-w-0">
        <div className="grid min-w-0">
          <TestimonialSearchInput />
          <TestimonialFilters />
        </div>
        <Testimonials orgId={_id} />
      </div>
    </main>
  );
}