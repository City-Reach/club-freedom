import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext } from "@tanstack/react-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  textEnabled: z.boolean(),
  audioEnabled: z.boolean(),
  videoEnabled: z.boolean(),
  agreements: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .min(1)
    .max(3),
});

type FormSchema = z.infer<typeof formSchema>;

export default function FormPreferenceForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const defaultAgreement =
    "I agree that my personal information and testimonial may be processsed and published on this service.";
  const form = useForm<FormSchema>({
    defaultValues: {
      name: "default",
      textEnabled: true,
      audioEnabled: true,
      videoEnabled: true,
      agreements: [{ value: defaultAgreement }], // ✅ always start with one
    },
    resolver: zodResolver(formSchema),
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "agreements",
  });

  const handleCreateForm = async (data: FormSchema) => {
    // const { error } = await authClient.organization.inviteMember({
    //   email: data.email,
    //   role: data.role,
    //   organizationId: organization._id,
    // });
    console.log("Form data:");
    console.log(data);

    // if (!error) {
    //   toast.success("Form created successfully");
    //   form.reset();
    // } else {
    //   toast.error("Failed to create form");
    // }
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
                    {...field} // ✅ correct
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
