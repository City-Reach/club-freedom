import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { defaultAgreement, type FormSchema, formSchema } from "./formSchema";

export default function FormPreferenceCreationForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const postFormPreference = useMutation(
    api.formPreferences.postFormPreference,
  );
  const form = useForm<FormSchema>({
    defaultValues: {
      name: "default",
      textEnabled: true,
      audioEnabled: true,
      videoEnabled: true,
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
        textEnabled: data.textEnabled,
        audioEnabled: data.audioEnabled,
        videoEnabled: data.videoEnabled,
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
        control={control}
        name="textEnabled"
        render={({ field, fieldState }) => (
          <Field className="min-w-30">
            <FieldLabel>Enable Text Input</FieldLabel>
            <Select
              value={field.value.toString()}
              onValueChange={(val) => field.onChange(val === "true")}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue />
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
        control={control}
        name="audioEnabled"
        render={({ field, fieldState }) => (
          <Field className="min-w-30">
            <FieldLabel>Enable Audio Input</FieldLabel>
            <Select
              value={field.value.toString()}
              onValueChange={(val) => field.onChange(val === "true")}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue />
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
        control={control}
        name="videoEnabled"
        render={({ field, fieldState }) => (
          <Field className="min-w-30">
            <FieldLabel>Enable Video Input</FieldLabel>
            <Select
              value={field.value.toString()}
              onValueChange={(val) => field.onChange(val === "true")}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue />
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
