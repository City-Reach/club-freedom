import { createContext, useContext } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

type TestimonialContext = {
  testimonial: Doc<"testimonials">;
};

export const TestimonialContext = createContext<TestimonialContext | null>(
  null,
);

export function useTestimonialContext() {
  const context = useContext(TestimonialContext);
  if (!context) {
    throw new Error(
      "useTestimonialContext must be used within a TestimonialContext.Provider",
    );
  }
  return context;
}
