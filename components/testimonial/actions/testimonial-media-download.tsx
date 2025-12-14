import { Link } from "@tanstack/react-router";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTestimonialActionContext } from "./context";

export default function TestimonialMediaDownload() {
  const { testimonial, organization } = useTestimonialActionContext();

  if (
    testimonial.media_type !== "audio" &&
    testimonial.media_type !== "video"
  ) {
    return null;
  }

  return (
    <Button asChild>
      <Link
        to="/o/$orgSlug/testimonials/$id/download"
        params={{ id: testimonial._id, orgSlug: organization.slug }}
        target="_blank"
      >
        <DownloadIcon />
        Download {testimonial.media_type === "audio" ? "Audio" : "Video"}
      </Link>
    </Button>
  );
}
