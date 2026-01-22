import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTestimonialFilter } from "../schema";

type Props = {
  onSuccess?: () => void;
};

export default function AuthoutInput({ onSuccess }: Props) {
  const [filter, setFilter] = useTestimonialFilter();
  const form = useForm({
    defaultValues: {
      author: filter.author,
    },
  });

  return (
    <form
      className="flex flex-col gap-2 p-1"
      onSubmit={form.handleSubmit((values) => {
        setFilter({ author: values.author });
        onSuccess?.();
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
  );
}
