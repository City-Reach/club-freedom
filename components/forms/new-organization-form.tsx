import React, { ComponentProps, ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

type Props = {
  trigger: ReactNode;
} & ComponentProps<typeof Dialog>;

const organizationSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters long",
    })
    .max(100, {
      message: "Name must be at most 100 characters long",
    })
    .refine((data) => data.toLocaleLowerCase().toLowerCase() !== "admin", {
      error: "Admin is not allowed",
    }),
});

type Organization = z.infer<typeof organizationSchema>;

export default function NewOrganizationDialog({ trigger, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<Organization>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(organizationSchema),
  });

  const slug = form.watch("name").toLowerCase().replace(/\s+/g, "-");

  const onSubmit = async (formData: Organization) => {
    const { data, error } = await authClient.organization.create({
      name: formData.name.trim(),
      slug: formData.name.trim().toLowerCase().replace(/\s+/g, "-"),
    });
    if (error || !data) {
      form.setError("name", {
        message: error?.message || "An error occurred. Please try again",
      });
      return;
    }
    toast.success("Organization created successfully");
    setOpen(false);
  };
  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          id="create-organization"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  placeholder="Your organization name"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {slug && (
                  <FieldDescription>
                    Your URL name will be <strong>{slug}</strong>
                  </FieldDescription>
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            form="create-organization"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
