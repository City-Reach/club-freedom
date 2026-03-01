import { convexQuery } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type FormSchema,
  formSchema,
} from "@/components/form-preferences/formSchema";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
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
import { FormPreferenceContext } from "@/contexts/form-preference-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Props = {
  formPreferenceId: string;
};

export default function FormPreferenceDetail({ formPreferenceId }: Props) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { data: formPreference } = useSuspenseQuery(
    convexQuery(api.formPreferences.getFormPreferenceByIdAndOrgId, {
      id: formPreferenceId,
      orgId: organization._id,
    }),
  );

  const updateFormPreference = useMutation(
    api.formPreferences.updateFormPreference,
  );

  const form = useForm<FormSchema>({
    defaultValues: {
      name: "",
      textEnabled: true,
      audioEnabled: false,
      videoEnabled: false,
      agreements: [],
    },
    resolver: zodResolver(formSchema),
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "agreements",
  });

  // Sync fetched data into form
  useEffect(() => {
    if (!formPreference) return;

    form.reset({
      name: formPreference.name,
      textEnabled: formPreference.textEnabled,
      audioEnabled: formPreference.audioEnabled,
      videoEnabled: formPreference.videoEnabled,
      agreements: formPreference.agreements?.map((a) => ({ value: a })) ?? [],
    });
  }, [formPreference, form]);

  const handleUpdateForm = async (data: FormSchema) => {
    try {
      await updateFormPreference({
        _id: formPreferenceId as Id<"formPreferences">,
        name: data.name,
        textEnabled: data.textEnabled,
        audioEnabled: data.audioEnabled,
        videoEnabled: data.videoEnabled,
        agreements: data.agreements.map((a) => a.value),
      });

      // Reset to latest saved values
      form.reset({
        name: data.name,
        textEnabled: data.textEnabled,
        audioEnabled: data.audioEnabled,
        videoEnabled: data.videoEnabled,
        agreements: data.agreements,
      });

      toast.success("Form preference updated successfully!", {
        description: "Your changes have been saved.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      toast.error("Failed to update form preference", {
        description: message,
      });
    }
  };

  if (!formPreference) {
    return (
      <Empty>
        <EmptyTitle>Form Preference not found.</EmptyTitle>
        <EmptyDescription>
          The form preference you are looking for could not be found.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <FormPreferenceContext.Provider value={{ formPreference }}>
      <form
        className="flex flex-col gap-4"
        id="organization-form-preference"
        onSubmit={form.handleSubmit(handleUpdateForm)}
      >
        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Form Name</FieldLabel>
              <Input
                {...field}
                placeholder="Form name"
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Text Enabled */}
        <Controller
          control={control}
          name="textEnabled"
          render={({ field }) => (
            <Field>
              <FieldLabel>Enable Text Input</FieldLabel>
              <Select
                value={field.value?.toString() ?? "false"}
                onValueChange={(val) => field.onChange(val === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[true, false].map((val) => (
                      <SelectItem key={val.toString()} value={val.toString()}>
                        {val ? "Enabled" : "Disabled"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Audio Enabled */}
        <Controller
          control={control}
          name="audioEnabled"
          render={({ field }) => (
            <Field>
              <FieldLabel>Enable Audio Input</FieldLabel>
              <Select
                value={field.value?.toString() ?? "false"}
                onValueChange={(val) => field.onChange(val === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[true, false].map((val) => (
                      <SelectItem key={val.toString()} value={val.toString()}>
                        {val ? "Enabled" : "Disabled"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Video Enabled */}
        <Controller
          control={control}
          name="videoEnabled"
          render={({ field }) => (
            <Field>
              <FieldLabel>Enable Video Input</FieldLabel>
              <Select
                value={field.value?.toString() ?? "false"}
                onValueChange={(val) => field.onChange(val === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[true, false].map((val) => (
                      <SelectItem key={val.toString()} value={val.toString()}>
                        {val ? "Enabled" : "Disabled"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Agreements */}
        <Field>
          <FieldLabel>Agreements</FieldLabel>

          <div className="flex flex-col gap-2">
            {fields.map((item, index) => (
              <Controller
                key={item.id}
                control={control}
                name={`agreements.${index}.value`}
                render={({ field }) => (
                  <div className="flex gap-2 items-start">
                    <Textarea
                      {...field}
                      placeholder="Enter agreement text..."
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
              onClick={() => append({ value: "" })}
              className="text-sm text-blue-500 mt-2"
            >
              + Add agreement
            </button>
          )}
        </Field>
      </form>
    </FormPreferenceContext.Provider>
  );
}
