import { roleSchema } from "@/lib/auth/app-invite/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ALL_ROLES } from "@/lib/auth/permissions";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z.email(),
  role: roleSchema,
});

type InviteMember = z.infer<typeof formSchema>;

export default function InviteMemberForm() {
  const form = useForm<InviteMember>({
    defaultValues: {
      email: "",
      role: "user",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: InviteMember) => {};

  return (
    <form
      className="flex flex-col sm:flex-row sm:flex-nowrap gap-x-2 gap-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="sm:grow">
            <FieldLabel htmlFor={field.name} className="sr-only">
              Email
            </FieldLabel>
            <Input
              {...field}
              placeholder="name@example.com"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="role"
        render={({ field }) => (
          <Field className="sm:w-full sm:max-w-[120px]">
            <FieldLabel htmlFor={field.name} className="sr-only">
              Role
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={field.name}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((role) => (
                  <SelectItem value={role} key={role}>
                    {`${role[0].toUpperCase()}${role.slice(1)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || !form.formState.isValid}
      >
        Invite
      </Button>
    </form>
  );
}
