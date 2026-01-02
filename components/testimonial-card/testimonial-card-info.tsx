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
          <span className="cursor-help">
            {formatDistanceToNow(_creationTime, { addSuffix: true })}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{format(_creationTime, "PPp")}</p>
        </TooltipContent>
      </Tooltip>
    </CardDescription>
  );
}
