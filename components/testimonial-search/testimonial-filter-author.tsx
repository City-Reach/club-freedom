import { ChevronDown, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useTestimonialFilter } from "./schema";

export default function TestimonialFilterAuthor() {
  const [filter, setFilter] = useTestimonialFilter();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      author: filter.author,
    },
  });

  return (
    <ButtonGroup>
      {filter.author ? (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            setFilter({
              testimonialTypes: [],
            })
          }
        >
          <XIcon /> Author
        </Button>
      ) : null}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn({
              "border-dashed": !filter.author,
              "text-primary": filter.author,
            })}
            size="sm"
          >
            {filter.author ? (
              <>
                {filter.author}
                <ChevronDown />
              </>
            ) : (
              <>
                <PlusIcon /> Author
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-56">
          <form
            className="flex flex-col gap-2 p-1"
            onSubmit={form.handleSubmit((values) => {
              setFilter((filter) => ({
                ...filter,
                author: values.author,
              }));
              setOpen(false);
            })}
          >
            <Controller
              control={form.control}
              name="author"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Author</FieldLabel>
                  <Input {...field} id={field.name} placeholder="Author Name" />
                </Field>
              )}
            />
            <Button type="submit">Apply</Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
