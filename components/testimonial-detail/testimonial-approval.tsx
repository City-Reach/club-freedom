import { useMutation } from "convex/react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function getApprovalValue(approve?: boolean) {
  if (approve === true) {
    return "approved" as const;
  } else if (approve === false) {
    return "disapproved" as const;
  } else {
    return "pending" as const;
  }
}

export default function TestimonialApproval() {
  const { testimonial } = useTestimonialContext();
  const [isPending, startTransition] = useTransition();

  const updateTestimonialApproval = useMutation(
    api.testimonials.updateTestimonialApproval,
  );

  const handleUpdateApprovalStatus = async (approved: boolean) => {
    startTransition(async () => {
      try {
        await updateTestimonialApproval({
          id: testimonial._id,
          approved,
        });
        if (approved) {
          toast.success("This testimonial has been published!");
        } else {
          toast.warning("This testimonial is no longer published!");
        }
      } catch (_error) {
        toast.error("Failed to update testimonial publish status.");
      }
    });
  };

  return (
    <Select
      value={getApprovalValue(testimonial.approved)}
      disabled={isPending}
      onValueChange={(value) => {
        handleUpdateApprovalStatus(value === "approved");
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" position="popper">
        <SelectGroup>
          <SelectLabel>Publish Status</SelectLabel>
          <SelectItem value="pending" hidden>
            Pending
          </SelectItem>
          <SelectItem value="approved">Published</SelectItem>
          <SelectItem value="disapproved">Not Published</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
