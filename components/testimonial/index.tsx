import type { ReactNode } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { TestimonialContext } from "./context";
import TestimonialAction from "./testimonial-action";
import TestimonialMedia from "./testimonial-media";
import TestimonialMetadata from "./testimonial-metadata";
import { TestimonialSummary } from "./testimonial-summary";
import TestimonialText from "./testimonial-text";
import { TestimonialTitle } from "./testimonial-title";

type Props = {
  testimonial: Doc<"testimonials">;
  children?: ReactNode;
};

export default function Testimonial({ testimonial, children }: Props) {
  return (
    <TestimonialContext.Provider value={{ testimonial }}>
      {children}
    </TestimonialContext.Provider>
  );
}

Testimonial.Title = TestimonialTitle;
Testimonial.Metadata = TestimonialMetadata;
Testimonial.Action = TestimonialAction;
Testimonial.Media = TestimonialMedia;
Testimonial.Summary = TestimonialSummary;
Testimonial.Text = TestimonialText;
