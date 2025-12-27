import { useTestimonialContext } from "./context";

export const TestimonialTitle = () => {
  const { testimonial } = useTestimonialContext();
  return (
    <h2 className="text-2xl font-bold">
      {testimonial.title || `Testimonial from ${testimonial.name}`}
    </h2>
  );
};
