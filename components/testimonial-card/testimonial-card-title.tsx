import { Link } from "@tanstack/react-router";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { CardTitle } from "../ui/card";

export default function TestimonialCardTitle() {
  const { testimonial } = useTestimonialContext();
  return (
    <Link to="/testimonials/$id" params={{ id: testimonial._id }}>
      <CardTitle className="testimonial-card-title hover:underline">
        {testimonial.title}
      </CardTitle>
    </Link>
  );
}
