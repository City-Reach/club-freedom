import { useTestimonialContext } from "@/contexts/testimonial-context";
import { CardTitle } from "../ui/card";

export default function TestimonialCardTitle() {
  const { testimonial } = useTestimonialContext();
  return (
    <CardTitle className="testimonial-card-title hover:underline">
      {testimonial.title}
    </CardTitle>
  );
}
