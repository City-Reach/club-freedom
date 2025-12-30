import { useTestimonialContext } from "@/contexts/testimonial-context";
import { Spinner } from "../ui/spinner";

export const TestimonialTitle = () => {
  const { testimonial } = useTestimonialContext();
  const title = testimonial.title || `Testimonial from ${testimonial.name}`;
  
  return (
    <h1 className="text-2xl font-bold">
      {title}
      {!testimonial.title && testimonial.processingStatus === "ongoing" && (
        <Spinner className="inline align-baseline size-5 ml-1" />
      )}
    </h1>
  );
};
