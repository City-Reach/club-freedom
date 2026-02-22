import { createFileRoute } from "@tanstack/react-router";
import { testimonialSearchQuerySchema } from "@/components/testimonial-search-query/schema";
import TestimonialSearchInput from "@/components/testimonial-search-query/testimonial-search-input";
import TestimonialFilters from "@/components/testimonial-search-query/testimonial-search-queries";
import Testimonials from "./-components/testimonials";

export const Route = createFileRoute("/o/$orgSlug/_public/testimonials/")({
  ssr: false,
  component: TestimonialsPage,
  validateSearch: testimonialSearchQuerySchema,
});

function TestimonialsPage() {
  return (
    <main className="container mx-auto px-4 mt-4">
      <div className="w-full grid gap-8 max-w-lg mx-auto mb-24 min-w-0">
        <div className="grid min-w-0">
          <TestimonialSearchInput />
          <TestimonialFilters />
        </div>
        <Testimonials />
      </div>
    </main>
  );
}
