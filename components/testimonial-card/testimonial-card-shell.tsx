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
      onClick={() =>
        navigate({
          to: "/testimonials/$id",
          params: {
            id: testimonial._id,
          },
        })
      }
      role="link"
      className={cn(className, "hover:bg-muted/25 cursor-pointer")}
      {...props}
    />
  );
}
