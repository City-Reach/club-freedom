import { useTestimonialContext } from "./context";

type Props = {
  mediaUrl: string;
};

export default function TestimonialMedia({ mediaUrl }: Props) {
  const { testimonial } = useTestimonialContext();

  if (testimonial.media_type === "audio") {
    return <audio src={mediaUrl} controls className="w-full" />;
  }

  if (testimonial.media_type === "video") {
    return <video src={mediaUrl} controls className="w-full" />;
  }

  return null;
}
