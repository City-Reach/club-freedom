import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

export default function TestimonialCardShell({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      role="link"
      className={cn(className, "hover:bg-muted/25")}
      {...props}
    />
  );
}
