import { convexQuery } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";
import {
  type Organization,
  organizationSchema,
} from "@/lib/schema/organization";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

type Props = {
  organization: Organization & { id: string };
};

export default function EditOrganizationForm({ organization }: Props) {
  const form = useForm<Organization>({
    resolver: zodResolver(organizationSchema),
    defaultValues: organization,
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = async (formData: Organization) => {
    const name =
      formData.name === organization.name ? undefined : formData.name;
    const slug =
      formData.slug === organization.slug ? undefined : formData.slug;

    const { data: updatedOrganization, error } =
      await authClient.organization.update({
        organizationId: organization.id,
        data: {
          name,
          slug,
        },
      });

    if (error) {
      toast.error("Cannot update organization", {
        description: error.message,
      });
      return;
    }

    toast.success("Organization updated successfully");

    const organizationBySlugQuery = (slug: string) =>
      convexQuery(api.organization.getOrganizationBySlug, {
        slug,
      });

    const allOrganizationsQuery = convexQuery(
      api.organization.getAllUserOrganizations,
      {},
    );

    await Promise.all([
      queryClient.removeQueries(organizationBySlugQuery(organization.slug)),
      queryClient.removeQueries(
        organizationBySlugQuery(updatedOrganization.slug),
      ),
      queryClient.removeQueries(allOrganizationsQuery),
    ]);

    await Promise.all([
      queryClient.ensureQueryData(
        organizationBySlugQuery(updatedOrganization.slug),
      ),
      queryClient.ensureQueryData(allOrganizationsQuery),
    ]);

    if (updatedOrganization.slug !== organization.slug) {
      await router.navigate({
        to: ".",
        params: { orgSlug: updatedOrganization.slug },
      });
    }
    await router.invalidate();
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
        {form.formState.isSubmitting ? (
          <>
            <Spinner />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </form>
  );
}
