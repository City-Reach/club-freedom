import { useMutation, useQuery } from "convex/react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useTestimonialContext } from "../context";

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
  const isAllowed = useQuery(api.organization.checkPermission, {
    permissions: {
      testimonial: ["approve"],
    },
  });

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

  if (!isAllowed) {
    return null;
  }

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
