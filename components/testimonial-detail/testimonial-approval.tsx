import { useMutation } from "convex/react";
import { Suspense, use, useTransition } from "react";
import { toast } from "sonner";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function getApprovalValue(approve?: boolean) {
  if (approve === true) {
    return "approve" as const;
  } else if (approve === false) {
    return "disapprove" as const;
  } else {
    return undefined;
  }
}

export default function TestimonialApproval() {
  const { testimonial } = useTestimonialContext();

  const updateTestimonialApproval = useMutation(
    api.testimonials.updateTestimonialApproval,
  );

  const handleApprovalOrDisapproval = async (approved: boolean) => {
    try {
      await updateTestimonialApproval({ id: testimonial._id, approved });
      if (approved) {
        toast.success("This testimonial has been approved!");
      } else {
        toast.warning("This testimonial has been rejected!");
      }
    } catch (_err) {
      toast.error("Failed to update testimonial approval");
    }
  };

  const [isPending, startTransition] = useTransition();
  return (
    <Select
      value={getApprovalValue(testimonial.approved)}
      disabled={isPending}
      onValueChange={(value) => {
        const approved = value === "approve";
        startTransition(() => handleApprovalOrDisapproval(approved));
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Approval Pending" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="approve">Approved</SelectItem>
          <SelectItem value="disapprove">Disapproved</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
