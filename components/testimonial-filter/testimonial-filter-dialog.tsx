import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { testimonialFilterSchema, useTestimonialFilter } from "./schema";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

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
          className="flex gap-2"
          id="testimonial-filter"
          onSubmit={form.handleSubmit((value) => setFilter(value))}
        >
          <Controller
            control={form.control}
            name="author"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Author</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Author Name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" form="testimonial-filter">
              Apply
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
