import { Doc } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getApprovalStatusText } from "@/utils/testimonial-utils";
import { isModOrAdmin } from "@/convex/lib/permissions";

type Props = {
  testimonial: Doc<"testimonials"> & { mediaUrl?: string | null };
};

export function TestimonialCard({ testimonial }: Props) {
  const date = new Date(testimonial._creationTime);
  const user = useQuery(api.auth.getCurrentUser);
  const approvalText = getApprovalStatusText(testimonial.approved);
  return (
    <Card className="w-full relative">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Link
            to="/testimonials/$id"
            params={{ id: testimonial._id }}
            className="hover:underline"
          >
            <CardTitle className="">{testimonial.title}</CardTitle>
          </Link>
          <div className="flex items-center gap-2">
            {isModOrAdmin(user?.role) && (
              <p className="text-sm">{approvalText}</p>
            )}
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(date, { addSuffix: true })}
            </p>
          </div>
        </div>
        <p className="text-sm">
          Posted by <strong>{testimonial.name}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {testimonial.mediaUrl && testimonial.media_type == "audio" && (
          <audio className="w-full" controls src={testimonial.mediaUrl} />
        )}
        {testimonial.mediaUrl && testimonial.media_type == "video" && (
          <video className="w-full" controls src={testimonial.mediaUrl} />
        )}
        {!testimonial.mediaUrl && testimonial.testimonialText && (
          <TestimonialTextPreview content={testimonial.testimonialText} />
        )}
        {testimonial.media_type !== "text" && (
          <CardDescription className="text-xs text-muted-foreground">
            {testimonial.summary}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

function TestimonialTextPreview({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-start">
      <p
        className={cn(
          "text-sm",
          isExpanded ? "line-clamp-none" : "line-clamp-5"
        )}
      >
        {content}
      </p>
      <Button
        variant="link"
        size="sm"
        className="p-0 ml-auto"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "view less" : "view more"}
      </Button>
    </div>
  );
}
