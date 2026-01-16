import { useTestimonialContext } from "@/contexts/testimonial-context";
import { Spinner } from "../ui/spinner";

export default function TestimonialText() {
  const { testimonial } = useTestimonialContext();
  return (
    <section>
      <h3 className="font-bold flex items-center gap-1.5">
        {testimonial.storageId ? "Transcription" : "Testimonial"}
        {!testimonial.testimonialText &&
          testimonial.processingStatus === "ongoing" && <Spinner />}
      </h3>
      {testimonial.testimonialText ? (
        <p>{testimonial.testimonialText}</p>
      ) : testimonial.processingStatus === "ongoing" ? (
        <p className="text-muted-foreground">
          Transcription will be available soon.
        </p>
      ) : (
        <p className="text-destructive">Transcription not available.</p>
      )}
    </section>
  );
}
