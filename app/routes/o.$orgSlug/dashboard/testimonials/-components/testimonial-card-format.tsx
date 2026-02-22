import { AudioWaveformIcon, TextIcon, VideoIcon } from "lucide-react";
import { useTestimonialContext } from "@/contexts/testimonial-context";

export default function TestimonialCardFormat() {
  const { testimonial } = useTestimonialContext();

  if (testimonial.media_type === "audio") {
    return <AudioWaveformIcon />;
  }

  if (testimonial.media_type === "video") {
    return <VideoIcon />;
  }

  return <TextIcon />;
}
