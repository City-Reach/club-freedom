import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type Props = {
  trigger: ReactNode;
} & ComponentProps<typeof Dialog>;

export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, {
      error: "Name must be at least 2 characters long",
    })
    .max(50, {
      error: "Name must be at most 50 characters long",
    }),
  slug: z
    .string()
    .min(2, {
      error: "Slug must be at least 2 characters long",
    })
    .max(50, {
      error: "Slug must be at most 50 characters long",
    })
    .refine((data) => /^[a-z0-9-]+$/.test(data), {
      error:
        "Only contains lower letters (a-z), numbers (0-9), and hyphens (-)",
    })
    .refine((data) => !data.startsWith("-") && !data.endsWith("-"), {
      error: "Slug should not begin or end with hypen (-)",
    }),
});

type Organization = z.infer<typeof organizationSchema>;

const convertNameToSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export default function NewOrganizationDialog({ trigger, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<Organization>({
    defaultValues: {
      name: "",
      slug: "",
    },
    resolver: zodResolver(organizationSchema),
  });

  const { mutateAsync: createNewOrganziation } = useMutation({
    mutationFn: async (formData: Organization) => {
      const { error } = await authClient.organization.create({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
      });
      if (error) {
        throw Error(error.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
    onSuccess: () => {
      toast.success("Organization created successfully");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Cannot create organization", {
        description: error.message,
      });
    },
  });

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    form.setValue("name", name);
    if (form.getFieldState("slug").isDirty) {
      return;
    }
    const generatedSlug = convertNameToSlug(name);
    const currentSlug = form.getValues("slug");
    if (generatedSlug !== currentSlug) {
      form.setValue("slug", generatedSlug, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
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
          onSubmit={form.handleSubmit((data) => createNewOrganziation(data))}
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  onChange={handleNameChange}
                  placeholder="Your organization name"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <FieldDescription>
                  This will be used in the organization URL.
                </FieldDescription>
                <Input
                  {...field}
                  placeholder="Your slug name"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
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
