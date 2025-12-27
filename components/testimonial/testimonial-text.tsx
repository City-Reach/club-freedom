import { Spinner } from "../ui/spinner";
import { useTestimonialContext } from "./context";

export default function TestimonialText() {
  const { testimonial } = useTestimonialContext();
  return (
    <section>
      <h3 className="font-bold flex items-center gap-1.5">
        {testimonial.media_id ? "Transcription" : "Testimonial"}
        {!testimonial.testimonialText && <Spinner />}
      </h3>

      {testimonial.testimonialText ? (
        <p>{testimonial.testimonialText}</p>
      ) : (
        <p className="text-muted-foreground">
          Transcription will be available soon.
        </p>
      )}
    </section>
  );
}
