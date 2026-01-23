import { useTestimonialContext } from "@/contexts/testimonial-context";
import { getApprovalStatusText } from "@/utils/testimonial-utils";
import { Badge } from "../ui/badge";

type Props = {
  className?: string;
};
export default function TestimonialCardApproval({
  className = "h-9 flex items-center",
}: Props) {
  const { testimonial } = useTestimonialContext();
  const approved = testimonial.approved;
  const text = getApprovalStatusText(approved);

  return (
    <Badge
      className={className}
      variant={
        approved === false
          ? "destructive"
          : approved === undefined
            ? "outline"
            : "default"
      }
    >
      {text}
    </Badge>
  );
}
