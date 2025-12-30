import { useTestimonialContext } from "@/contexts/testimonial-context";
import { formatDistance } from "date-fns";

export default function TestimonialMetadata() {
  const { testimonial } = useTestimonialContext();

  return (
    <div className="space-y-1">
      <h3 className="font-bold">Posted by {testimonial.name}</h3>
      <p className="font-mono text-muted-foreground">
        {formatDistance(testimonial._creationTime, Date.now(), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
}
