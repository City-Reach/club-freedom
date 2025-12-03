import { ALL_ROLES, displayRole } from "@/lib/auth/permissions/organization";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

const inviteMemberSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  role: z.enum(ALL_ROLES),
});

type InviteMember = z.infer<typeof inviteMemberSchema>;

export default function InviteMemberForm() {
  const form = useForm<InviteMember>({
    defaultValues: {
      email: "",
      role: "member",
    },
    resolver: zodResolver(inviteMemberSchema),
  });

  const onSubmit = (formData: InviteMember) => {
    
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-wrap gap-4"
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
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
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="max-w-[120px]">
            <FieldLabel htmlFor={field.name} className="sr-only">
              Role
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  {ALL_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {displayRole(role)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button disabled={form.formState.isSubmitting}>
        <Send />
        Send invite
      </Button>
    </form>
  );
}
