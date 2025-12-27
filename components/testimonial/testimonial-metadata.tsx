import { formatDistance } from "date-fns";
import { useTestimonialContext } from "./context";

export default function TestimonialMetadata() {
  const { testimonial } = useTestimonialContext();

  return (
    <div className="space-y-1">
      <h3 className="font-bold">Posted by {testimonial.name}</h3>
      <p className="text-muted-foreground">
        {testimonial._creationTime
          ? formatDistance(testimonial._creationTime, Date.now(), {
              addSuffix: true,
            })
          : "Date not available"}
      </p>
    </div>
  );
}
