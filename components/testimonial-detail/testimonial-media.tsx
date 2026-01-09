import { useTestimonialContext } from "@/contexts/testimonial-context";

type Props = {
  mediaUrl: string;
};

export default function TestimonialMedia({ mediaUrl }: Props) {
  const { testimonial } = useTestimonialContext();

  if (testimonial.media_type === "audio") {
    return (
      <audio
        src={mediaUrl}
        controls
        className="w-full"
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }

  if (testimonial.media_type === "video") {
    return (
      <video
        src={mediaUrl}
        controls
        className="w-full"
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }

  return null;
}
