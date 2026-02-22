import { useNavigate, useRouteContext } from "@tanstack/react-router";
import type { ComponentProps, KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { cn } from "@/lib/utils";

type TestimonialCardShellProps = ComponentProps<typeof Card> & {
  isPublic?: boolean;
};

export default function TestimonialCardShell({
  className,
  ...props
}: TestimonialCardShellProps) {
  const navigate = useNavigate({});
  const { testimonial } = useTestimonialContext();
  const { organization } = useRouteContext({ from: "/o/$orgSlug" });
  const handleNavigation = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }
    await navigate({
      to: "/o/$orgSlug/testimonials/$id",
      params: {
        orgSlug: organization.slug,
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
