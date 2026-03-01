import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useFormPreferenceIdParam } from "@/app/routes/o.$orgSlug/dashboard/form-preferences/-components/hook";
import { useFormPreferenceContext } from "@/contexts/form-preference-context";
import { api } from "@/convex/_generated/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";

export default function FormPreferenceListItem() {
  const { formPreference } = useFormPreferenceContext();
  const { setFormPreferenceId } = useFormPreferenceIdParam();

  const handleNavigation = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }
    setFormPreferenceId(formPreference._id as string);
  };

  // const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === "Enter" || e.key === " ") {
  //     e.preventDefault();
  //     handleNavigation();
  //   }
  // };

  return (
    <li className="flex justify-between">
      <div>
        <button
          type={"button"}
          onClick={handleNavigation}
          // onKeyDown={handleKeyDown}
          className="font-semibold"
        >
          {formPreference.name}
        </button>
      </div>
      <div className="flex gap-2">
        <ActivateFormPreference />
        <RemoveFormPreference />
      </div>
    </li>
  );
}

function ActivateFormPreference() {
  const { formPreference } = useFormPreferenceContext();
  const activateFormPreference = useMutation(
    api.formPreferences.activateFormPreference,
  );
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  async function handleActivate() {
    try {
      await activateFormPreference({
        id: formPreference._id,
        organizationId: organization._id,
      });
      toast.success("Form Preference activated successfully");
    } catch (_err) {
      if (_err instanceof Error) {
        toast.error(`Failed to activate form preference: ${_err.message}`);
      } else {
        toast.error(`Failed to activate form preference: ${_err}`);
      }
    }
  }

  return (
    <Button
      disabled={formPreference.activated}
      variant="outline"
      size="sm"
      onClick={() => handleActivate()}
    >
      Activate
    </Button>
  );
}

function RemoveFormPreference() {
  const { formPreference } = useFormPreferenceContext();
  const deleteFormPreference = useMutation(
    api.formPreferences.deleteFormPreference,
  );
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const navigate = useNavigate();
  async function handleDelete() {
    try {
      await deleteFormPreference({ id: formPreference._id });
      toast.success("Form Preference deleted successfully");
      await navigate({
        to: "/o/$orgSlug/dashboard/form-preferences",
        params: { orgSlug: organization.slug },
      });
    } catch (_err) {
      if (_err instanceof Error) {
        toast.error(`Failed to delete form preference: ${_err.message}`);
      } else {
        toast.error(`Failed to delete form preference: ${_err}`);
      }
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove this formPreference?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{formPreference.name}</strong> will be no longer a form
            preference of <strong>{organization.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className={buttonVariants({
              variant: "destructive",
            })}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
