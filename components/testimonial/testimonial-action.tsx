import type { ReactNode } from "react";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { TestimonialActionContext } from "./actions/context";
import { useTestimonialContext } from "./context";
import TestimonialMediaDownload from "./actions/testimonial-media-download";

type Props = {
  organization: Doc<"organization">;
  children?: ReactNode;
};

export default function TestimonialAction({ organization, children }: Props) {
  const { testimonial } = useTestimonialContext();
  return (
    <TestimonialActionContext.Provider value={{ organization, testimonial }}>
      {children}
    </TestimonialActionContext.Provider>
  );
}

TestimonialAction.MediaDownload = TestimonialMediaDownload;
