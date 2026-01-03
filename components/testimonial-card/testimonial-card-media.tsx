import { useTestimonialContext } from "@/contexts/testimonial-context";

type Props = {
  mediaUrl: string;
};

export default function TestimonialCardMedia({ mediaUrl }: Props) {
  const { testimonial } = useTestimonialContext();

  if (testimonial.media_type === "audio")
    return <audio className="w-full" controls src={mediaUrl} preload="metadata" />;

  if (testimonial.media_type === "video")
    return <video className="w-full" controls src={mediaUrl} preload="metadata" />;

  return null;
}
