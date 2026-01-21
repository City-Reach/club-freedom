import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { createStandardSchemaV1, parseAsString } from "nuqs";
import { testimonialFilterSchema } from "@/components/testimonial-filter/schema";
import TestimonialSearchInput from "@/components/testimonial-filter/testimonial-search-input";
import { Testimonials } from "@/components/testimonials";
import { Button } from "@/components/ui/button";
import TestimonialFilterDialog from "@/components/testimonial-filter/testimonial-filter-dialog";

export const testimonialSearchParams = {
  q: parseAsString.withDefault(""),
};

export const Route = createFileRoute("/testimonials/")({
  ssr: false,
  component: TestimonialsPage,
  validateSearch: createStandardSchemaV1(testimonialFilterSchema),
});

function TestimonialsPage() {
  const filter = Route.useSearch();
  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
            What Our Volunteers Say
          </h2>
          <p className="mx-auto max-w-175 text-muted-foreground md:text-xl text-balance">
            Don't just take our word for it. Here's what real volunteers have to
            say about their experience.
          </p>
        </div>
      </div>
      <div className="w-full max-w-lg mx-auto mb-24">
        <div className="flex pb-8 gap-2">
          <TestimonialSearchInput />
          <TestimonialFilterDialog
            trigger={
              <Button variant="outline" size="icon">
                <SlidersHorizontal />
              </Button>
            }
          />
        </div>
        <Testimonials filter={filter} />
      </div>
    </main>
  );
}
