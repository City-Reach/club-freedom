import { useNavigate } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

export default function TestimonialCardShell({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  const navigate = useNavigate({});
  const { testimonial } = useTestimonialContext();

  return (
    <Card
      role="link"
      onClick={async () => {
        // Don't navigate if user is selecting text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          return;
        }

        await navigate({
          to: "/testimonials/$id",
          params: {
            id: testimonial._id,
          },
        });
      }}
      className={cn(className, "hover:bg-muted/25 cursor-pointer")}
      {...props}
    />
  );
}
