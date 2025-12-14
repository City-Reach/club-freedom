import { Spinner } from "../ui/spinner";
import { useTestimonialContext } from "./context";

export const TestimonialSummary = () => {
  const { testimonial } = useTestimonialContext();
  return (
    <section>
      <h3 className="font-bold flex items-center gap-1.5">
        Summary {!testimonial.summary && <Spinner />}
      </h3>

      {testimonial.summary ? (
        <p>{testimonial.summary}</p>
      ) : (
        <p className="text-muted-foreground">Summary will be available soon.</p>
      )}
    </section>
  );
};
