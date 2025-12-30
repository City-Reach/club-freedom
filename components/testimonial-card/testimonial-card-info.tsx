import { format, formatDistanceToNow } from "date-fns";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { CardDescription } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function TestimonialCardInfo() {
  const { testimonial } = useTestimonialContext();
  const { name, _creationTime } = testimonial;

  return (
    <CardDescription>
      <strong>{name}</strong>
      {" · "}
      <Tooltip>
        <TooltipTrigger>
          <span className="underline">
            {formatDistanceToNow(_creationTime, { addSuffix: true })}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{format(_creationTime, "PPpp")}</p>
        </TooltipContent>
      </Tooltip>
    </CardDescription>
  );
}
