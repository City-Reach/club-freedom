import { createFileRoute } from "@tanstack/react-router";
import {
  createStandardSchemaV1,
  debounce,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { Testimonials } from "@/components/testimonials";
import { Input } from "@/components/ui/input";

export const testimonialSearchParams = {
  q: parseAsString.withDefault(""),
};
export const Route = createFileRoute("/o/$orgSlug/_dashboard/testimonials")({
  ssr: false,
  component: TestimonialsPage,
  validateSearch: createStandardSchemaV1(testimonialSearchParams, {
    partialOutput: true,
  }),
});

function TestimonialsPage() {
  const search = Route.useSearch();
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
      <div className="w-full space-y-8 max-w-lg mx-auto mb-24">
        <TestimonialSearchInput />
        <Testimonials search={search.q ?? ""} />
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
