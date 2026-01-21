import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  testimonialFilterSchema,
  useTestimonialFilter,
} from "./schema";

type Props = {
  trigger: ReactNode;
};

export default function TestimonialFilterDialog({ trigger }: Props) {
  const [filter, setFilter] = useTestimonialFilter();
  const form = useForm({
    defaultValues: filter,
    resolver: standardSchemaResolver(testimonialFilterSchema),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <form
          className="flex"
          id="testimonial-filter"
          onSubmit={form.handleSubmit((value) => setFilter(value))}
        >
          
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" form="testimonial-filter">
              Filter
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
