import { Badge } from "@/components/ui/badge";
import { useTestimonialContext } from "@/contexts/testimonial-context";

export default function TestimonialCardFormat() {
  const { testimonial } = useTestimonialContext();

  if (testimonial.media_type === "audio") {
    return <Badge variant="outline">Audio</Badge>;
  }

  if (testimonial.media_type === "video") {
    return <Badge variant="outline">Video</Badge>;
  }

  return <Badge variant="outline">Text</Badge>;
}
