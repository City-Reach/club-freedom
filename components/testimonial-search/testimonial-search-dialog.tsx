import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
  getTestimonialTypeLabel,
  testimonialFilterSchema,
  testimonialTypes,
  useTestimonialFilter,
} from "./schema";
import TestimonialDateInput from "./testimonial-date-input";

type Props = {
  trigger: ReactNode;
};

export default function TestimonialSearchDialog({ trigger }: Props) {
  const [filter, setFilter] = useTestimonialFilter();
  const form = useForm({
    defaultValues: filter,
    resolver: standardSchemaResolver(testimonialFilterSchema),
  });

  useEffect(() => {
    form.reset(filter);
  }, [filter, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          id="testimonial-filter"
          onSubmit={form.handleSubmit((value) => setFilter(value))}
        >
          <Controller
            control={form.control}
            name="q"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Testimonials</FieldLabel>
                <FieldDescription>
                  Search for testimonials by author, summary, or content.
                </FieldDescription>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder=""
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
          <Controller
            control={form.control}
            name="testimonialTypes"
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend variant="label">Testimonial Types</FieldLegend>
                <FieldGroup
                  data-slot="checkbox-group"
                  className="grid sm:grid-cols-3"
                >
                  {testimonialTypes.map((type) => (
                    <Field key={type} orientation="horizontal">
                      <Checkbox
                        id={`testimonial-checkbox-${type}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value?.includes(type)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), type]
                            : field.value?.filter((value) => value !== type);
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`testimonial-checkbox-${type}`}
                        className="font-normal"
                      >
                        {getTestimonialTypeLabel(type)}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            )}
          />
          <FieldSet>
            <FieldLegend>Submission Date</FieldLegend>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="from"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>From</FieldLabel>
                      <TestimonialDateInput
                        date={field.value || undefined}
                        onDateChange={field.onChange}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="to"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>To</FieldLabel>
                      <TestimonialDateInput
                        date={field.value || undefined}
                        onDateChange={field.onChange}
                      />
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>
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
