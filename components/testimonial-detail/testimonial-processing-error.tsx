import { useMutation } from "convex/react";
import { AlertCircle } from "lucide-react";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
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
  const retryProcessing = useMutation(api.testimonials.retryProcessing);

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
