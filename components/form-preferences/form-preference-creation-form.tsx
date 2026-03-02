import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "../ui/checkbox";
import { defaultAgreement, type FormSchema, formSchema } from "./schema";

export default function FormPreferenceCreationForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const postFormPreference = useMutation(
    api.formPreferences.postFormPreference,
  );

  const form = useForm<FormSchema>({
    defaultValues: {
      formats: ["video", "audio", "text"],
      agreements: [{ value: defaultAgreement }],
    },
    resolver: zodResolver(formSchema),
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "agreements",
  });

  const handleCreateForm = async (data: FormSchema) => {
    try {
      await postFormPreference({
        organizationId: organization._id,
        name: data.name,
        textEnabled: data.formats.includes("text"),
        audioEnabled: data.formats.includes("audio"),
        videoEnabled: data.formats.includes("video"),
        agreements: data.agreements.map((a) => a.value),
      });
      form.reset();
      toast.success("Form preference created successfully!", {
        description: "Thank you for creating a form preference.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to submit form preference", {
        description: message,
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      id="organization-form-preference"
      onSubmit={form.handleSubmit(handleCreateForm)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <FieldDescription>
              Give a name for your testimonial form
            </FieldDescription>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Testimonial form name"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={control}
        name="formats"
        render={({ field, fieldState }) => (
          <FieldSet>
            <FieldLegend>Formats</FieldLegend>
            <FieldDescription>
              Choose the formats you want to enable
            </FieldDescription>
            <FieldGroup>
              {(["video", "audio", "text"] as const).map((format) => (
                <Field
                  key={format}
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox
                    id={`testimonial-format-${format}`}
                    name={field.name}
                    checked={field.value.includes(format)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, format]
                        : field.value.filter((f) => f !== format);
                      field.onChange(newValue);
                    }}
                  />
                  <FieldLabel
                    htmlFor={`testimonial-format-${format}`}
                    className="font-normal"
                  >
                    {format}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
        )}
      />
      <Field>
        <FieldLabel>Agreements</FieldLabel>

        <div className="flex flex-col gap-2">
          {fields.map((item, index) => (
            <Controller
              key={item.id}
              control={control}
              name={`agreements.${index}.value`}
              render={({ field, fieldState }) => (
                <div className="flex gap-2 items-start">
                  <Textarea
                    {...field}
                    placeholder={defaultAgreement}
                    aria-invalid={fieldState.invalid}
                  />

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            />
          ))}
        </div>

        {fields.length < 3 && (
          <button
            type="button"
            onClick={() => append({ value: defaultAgreement })}
            className="text-sm text-blue-500 mt-2"
          >
            + Add agreement
          </button>
        )}
      </Field>
    </form>
  );
}
