import { useTestimonialContext } from "@/contexts/testimonial-context";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

export default function TestimonialMediaDownload() {
  const { testimonial } = useTestimonialContext();

  return (
    <Button asChild>
      <Link
        to="/testimonials/$id/media-download"
        params={{ id: testimonial._id }}
        target="_blank"
      >
        Download {testimonial.media_type === "audio" ? "Audio" : "Video"}
      </Link>
    </Button>
  );
}
