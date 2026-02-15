import { createFileRoute } from "@tanstack/react-router";
import TestimonialSearchInput from "@/components/testimonial-search-query/testimonial-search-input";
import TestimonialFilters from "@/components/testimonial-search-query/testimonial-search-queries";
import { Testimonials } from "@/components/testimonials";

export const Route = createFileRoute("/o/$orgSlug/_public/testimonials/")({
  ssr: false,
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { organization } = Route.useRouteContext();

  return (
    <main className="container mx-auto px-4 mt-4">
      <div className="w-full grid gap-8 max-w-lg mx-auto mb-24 min-w-0">
        <div className="grid min-w-0">
          <TestimonialSearchInput />
          <TestimonialFilters />
        </div>
        <Testimonials orgId={organization._id} />
      </div>
    </main>
  );
}
