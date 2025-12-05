import { useNavigate, useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { organizationSchema } from "./new-organization-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Organization } from "better-auth/plugins";

const editOrganizationSchema = z.intersection(
  organizationSchema,
  z.object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        error:
          "Slug must be lowercase and contain only letters, numbers, and connected with dash",
      })
      .refine((data) => data !== "admin", {
        error: "Not the valid slug",
      }),
  }),
);

type EditOrganization = z.infer<typeof editOrganizationSchema>;

type Props = {
  current: Organization;
};

export default function OrganizationEditForm({ current }: Props) {
  const router = useRouter();
  const navigate = useNavigate();

  const form = useForm<EditOrganization>({
    defaultValues: {
      name: current.name || "",
      slug: current.slug || "",
    },
    resolver: zodResolver(editOrganizationSchema),
  });

  const onSubmit = async (formData: EditOrganization) => {
    const { name, slug } = formData;
    const { error } = await authClient.organization.update({
      data: {
        name: name === current?.name ? undefined : name,
        slug: slug === current?.slug ? undefined : slug,
      },
      organizationId: current.id,
    });

    if (error) {
      toast.error("Cannot update organization", {
        description: error.message || "An unknown error occurred",
      });
      return;
    }

    toast.success("Organization updated successfully");
    await router.invalidate({
      filter: (route) => route.pathname.startsWith("/o"),
    });
    await navigate({ to: "/o/$slug/settings", params: { slug } });
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="slug"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
            <Input
              {...field}
              placeholder="your-organization-slug"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="place-self-start"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        Save
      </Button>
    </form>
  );
}
