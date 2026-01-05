import { useTestimonialContext } from "@/contexts/testimonial-context";
import { Spinner } from "../ui/spinner";

export default function TestimonialSummary() {
  const { testimonial } = useTestimonialContext();
  return (
    <section>
      <h3 className="font-bold flex items-center gap-1.5">
        Summary{" "}
        {!testimonial.summary && testimonial.processingStatus === "ongoing" && (
          <Spinner />
        )}
      </h3>

      {testimonial.summary ? (
        <p>{testimonial.summary}</p>
      ) : testimonial.processingStatus === "ongoing" ? (
        <p className="text-muted-foreground">Summary will be available soon.</p>
      ) : (
        <p className="text-destructive">Summary not available.</p>
      )}
    </section>
  );
}
