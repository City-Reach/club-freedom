import { useTestimonialContext } from "@/contexts/testimonial-context";
import { CardDescription } from "../ui/card";

export default function TestimonialCardSummary() {
  const { testimonial } = useTestimonialContext();

  return (
    <CardDescription className="text-xs text-muted-foreground">
      {testimonial.summary}
    </CardDescription>
  );
}
