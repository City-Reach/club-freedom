import { createContext, type ReactNode, useContext } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import type { Doc as AuthDoc } from "@/convex/betterAuth/_generated/dataModel";

type TestimonialActionContext = {
  testimonial: Doc<"testimonials">;
  organization: AuthDoc<"organization">;
};

export const TestimonialActionContext =
  createContext<TestimonialActionContext | null>(null);

export const useTestimonialActionContext = () => {
  const context = useContext(TestimonialActionContext);
  if (!context) {
    throw new Error(
      "useTestimonialContext must be used within a TestimonialActionContext.Provider",
    );
  }
  return context;
};
