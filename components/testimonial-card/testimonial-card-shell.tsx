import { useNavigate } from "@tanstack/react-router";
import type { ComponentProps, KeyboardEvent } from "react";
import { Route } from "@/app/routes/o.$orgSlug/testimonials/index";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

export default function TestimonialCardShell({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  const navigate = useNavigate({});
  const { testimonial } = useTestimonialContext();
  const { orgSlug } = Route.useParams();
  const handleNavigation = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }

    await navigate({
      to: "/o/$orgSlug/testimonials/$id",
      params: {
        orgSlug: orgSlug,
        id: testimonial._id,
      },
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigation();
    }
  };

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
      className={cn(className, "hover:bg-muted/25 cursor-pointer")}
      {...props}
    />
  );
}
