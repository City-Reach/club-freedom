import { useTestimonialContext } from "@/contexts/testimonial-context";
import { getApprovalStatusText } from "@/utils/testimonial-utils";
import { Badge } from "../ui/badge";

export default function TestimonialCardApproval() {
  const { testimonial } = useTestimonialContext();
  const approved = testimonial.approved;
  const text = getApprovalStatusText(approved);

  return (
    <Badge
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
