import { Link } from "@tanstack/react-router";
import { DownloadIcon } from "lucide-react";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { Button } from "../ui/button";
import { useTestimonialContext } from "./context";

type Props = {
  organization: Doc<"organization">;
};

export default function TestimonialDownload({ organization }: Props) {
  const { testimonial } = useTestimonialContext();

  if (!testimonial.media_type) {
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
