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

  const updateTestimonialApproval = useMutation(
    api.testimonials.updateTestimonialApproval,
  );

  const handleUpdateApprovalStatus = async (approved?: boolean) => {
    try {
      await updateTestimonialApproval({ id: testimonial._id, approved });
      if (approved === true) {
        toast.success("This testimonial has been published!");
      } else if (approved === false) {
        toast.warning("This testimonial is no longer published!");
      } else {
        toast.info("This testimonial is now pending!");
      }
    } catch (_err) {
      toast.error("Failed to update testimonial publishing status.");
    }
  };

  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={getApprovalValue(testimonial.approved)}
      disabled={isPending}
      onValueChange={(value) => {
        const approved = value === "pending" ? undefined : value === "approved";
        startTransition(() => handleUpdateApprovalStatus(approved));
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          <SelectLabel>Publish Status</SelectLabel>
          <SelectItem value="pending">Pending Approval</SelectItem>
          <SelectItem value="approved">Published</SelectItem>
          <SelectItem value="disapproved">Not Published</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
