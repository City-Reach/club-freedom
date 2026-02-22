import { parseAsString, useQueryState } from "nuqs";

export function useTestimonialIdParam() {
  const [testimonialId, setTestimonialId] = useQueryState("id", parseAsString);

  return { testimonialId, setTestimonialId };
}
