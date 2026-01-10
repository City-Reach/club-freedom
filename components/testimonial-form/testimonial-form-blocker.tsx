import { useBlocker } from "@tanstack/react-router";
import type { RefObject } from "react";
import { useFormContext } from "react-hook-form";
import type { Testimonial } from "@/lib/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type Props = {
  isSubmittedSuccessfully: RefObject<boolean>;
};

export default function TestimonialFormBlocker({
  isSubmittedSuccessfully,
}: Props) {
  const form = useFormContext<Testimonial>();

  const { status, reset, proceed } = useBlocker({
    shouldBlockFn: () =>
      form.formState.isDirty && !isSubmittedSuccessfully.current,
    enableBeforeUnload:
      form.formState.isDirty && !isSubmittedSuccessfully.current,
    withResolver: true,
  });

  return (
    <AlertDialog open={status === "blocked"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are not completed the form</AlertDialogTitle>
          <AlertDialogDescription>
            All your changes will be lost. Are you sure you want to leave?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
