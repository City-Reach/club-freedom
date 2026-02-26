import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "@tanstack/react-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // branding: v.optional(v.string()),
  // textInstructions: v.optional(v.string()),
  textEnabled: z.boolean(),
  // audioInstructions: v.optional(v.string()),
  audioEnabled: z.boolean(),
  // videoInstructions: v.optional(v.string()),
  videoEnabled: z.boolean(),
  agreements: z.array(z.string()).min(1).max(3),
});

type FormSchema = z.infer<typeof formSchema>;

export default function FormPreferenceForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const form = useForm<FormSchema>({
    defaultValues: {
      name: "default",
      textEnabled: true,
      audioEnabled: true,
      videoEnabled: true,
      agreements: [
        "I agree that my personal information and testimonial may be processsed and published on this service.",
      ],
    },
    resolver: zodResolver(formSchema),
  });

  const { control } = form;

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "agreements",
  // });

  return (
    <form
      className="flex flex-col gap-4"
      id="form-preference-form"
      // onSubmit={form.handleSubmit(handleInvite)}
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Form Name</FieldLabel>
            <Input
              {...field}
              placeholder="your_form_name"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="textEnabled"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex-0 min-w-30">
            <FieldLabel htmlFor={field.name}>Enable Text Input</FieldLabel>
            <Select
              value={field.value.toString()}
              onValueChange={field.onChange}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder={true} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[true, false].map((isEnabled) => (
                    <SelectItem
                      key={isEnabled.toString()}
                      value={isEnabled.toString()}
                    >
                      {isEnabled ? "Enabled" : "Disabled"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="audioEnabled"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex-0 min-w-30">
            <FieldLabel htmlFor={field.name}>Enable Audio Input</FieldLabel>
            <Select
              value={field.value.toString()}
              onValueChange={field.onChange}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder={true} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[true, false].map((isEnabled) => (
                    <SelectItem
                      key={isEnabled.toString()}
                      value={isEnabled.toString()}
                    >
                      {isEnabled ? "Enabled" : "Disabled"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="videoEnabled"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex-0 min-w-30">
            <FieldLabel htmlFor={field.name}>Enable Video Input</FieldLabel>
            <Select
              value={field.value.toString()}
              onValueChange={field.onChange}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder={true} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[true, false].map((isEnabled) => (
                    <SelectItem
                      key={isEnabled.toString()}
                      value={isEnabled.toString()}
                    >
                      {isEnabled ? "Enabled" : "Disabled"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="agreements"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Agreements</FieldLabel>
            <Textarea
              {...field}
              placeholder="I agree that my personal information and testimonial may be processsed and published on this service."
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
