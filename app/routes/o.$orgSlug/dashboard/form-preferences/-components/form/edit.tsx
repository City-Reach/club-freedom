import { zodResolver } from "@hookform/resolvers/zod";
import {
  useLoaderData,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { PlusIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { api } from "@/convex/_generated/api";
import MarkdownEditorWithLinks from "./agreement-editor";
import { defaultAgreement, type FormSchema, formSchema } from "./schema";
import { useMemo } from "react";

export default function FormPreferenceEditForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { formPreferences } = useLoaderData({
    from: "/o/$orgSlug/dashboard/form-preferences/$id",
  });

  const formats = useMemo(() => {
    const result = [] as ("video" | "audio" | "text")[];
    if (formPreferences.videoEnabled) {
      result.push("video");
    }
    if (formPreferences.audioEnabled) {
      result.push("audio");
    }
    if (formPreferences.textEnabled) {
      result.push("text");
    }
    return result;
  }, [formPreferences]);

  const updateFormPreference = useMutation(
    api.formPreferences.updateFormPreference,
  );
  const router = useRouter();

  const form = useForm<FormSchema>({
    defaultValues: {
      name: formPreferences.name,
      formats,
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
      await updateFormPreference({
        _id: formPreferences._id,
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
      await router.navigate({
        to: "/o/$orgSlug/dashboard/form-preferences",
        params: { orgSlug: organization.slug },
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
      className="flex flex-col gap-8"
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
            <FieldGroup className="flow-col @sm/dashboard:flex-row gap-2">
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldSet>
        )}
      />
      <FieldSet>
        <FieldLegend>Agreements</FieldLegend>
        <FieldDescription>Add or remove agreements</FieldDescription>

        <div className="flex flex-col gap-2">
          {fields.map((item, index) => (
            <Controller
              key={item.id}
              control={control}
              name={`agreements.${index}.value`}
              render={({ field }) => (
                <MarkdownEditorWithLinks
                  markdown={field.value}
                  onMarkdownChange={field.onChange}
                  onDelete={
                    fields.length > 1
                      ? () => {
                          remove(index);
                        }
                      : undefined
                  }
                />
              )}
            />
          ))}
        </div>

        {fields.length < 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ value: defaultAgreement })}
            className="border-dashed"
          >
            <PlusIcon /> Add agreement
          </Button>
        )}
      </FieldSet>

      <Button type="submit">Create</Button>
    </form>
  );
}
