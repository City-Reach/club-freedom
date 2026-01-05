import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "convex/react";
import { AlertCircle } from "lucide-react";
import { triggerTaskServerFn } from "@/app/functions/triggerTask";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "../ui/item";

export default function TestimonialProcessingError() {
  const { testimonial } = useTestimonialContext();
  const triggerTask = useServerFn(triggerTaskServerFn);
  const updateTestimonial = useMutation(api.testimonials.updateTestimonial);
  const retrySummarizing = useMutation(api.testimonials.retrySummarizing);

  async function retryProcessing({ id }: { id: Id<"testimonials"> }) {
    await updateTestimonial({ _id: id, processingStatus: "ongoing" });
    if (testimonial && testimonial.storageId) {
      await triggerTask({
        data: {
          testimonialId: id,
          mediaKey: testimonial?.storageId,
        },
      });
    }
    await retrySummarizing({ id });
  }
  return (
    <Item variant="outline" size="sm">
      <ItemMedia className="text-destructive">
        <AlertCircle className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-destructive">
          Failed to process testimonial.
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => retryProcessing({ id: testimonial._id })}
        >
          Try again
        </Button>
      </ItemActions>
    </Item>
  );
}
