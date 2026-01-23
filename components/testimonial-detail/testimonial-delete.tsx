import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Props = {
  _id: Id<"testimonials">;
  className?: string;
};
export default function TestimonialDelete({
  _id,
  className = "text-red-500 h-9 flex items-center",
}: Props) {
  const navigate = useNavigate();
  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);
  async function handleDelete() {
    try {
      await deleteTestimonial({ id: _id });
      toast.success("Testimonial deleted successfully");
      await navigate({ to: "/testimonials" });
    } catch (_err) {
      if (_err instanceof Error) {
        toast.error(`Failed to delete testimonial: ${_err.message}`);
      } else {
        toast.error(`Failed to delete testimonial: ${_err}`);
      }
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={className}
          variant="outline"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently the testimonial
            and testimonial media.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
