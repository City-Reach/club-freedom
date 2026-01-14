import { format } from "date-fns";
import { useTestimonialContext } from "@/contexts/testimonial-context";

export default function TestimonialInfo() {
  const { testimonial } = useTestimonialContext();

  return (
    <div className="space-y-1">
      <h3 className="font-bold">Posted by {testimonial.name}</h3>
      <p className="text-muted-foreground">
        {format(testimonial._creationTime, "PPp")}
      </p>
    </div>
  );
}
