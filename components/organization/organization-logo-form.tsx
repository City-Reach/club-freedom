import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useUploadFile } from "@/hooks/use-upload-file";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "../ui/button";

export default function OrganizationLogoForm() {
  const uploadFile = useUploadFile();
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const generateUploadUrl = useConvexMutation(
    api.organization.generateLogoUploadUrl,
  );

  const [{ files }, { clearFiles, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      multiple: false,
    });

  const { mutate: updateLogo, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const { url, key, storageUrl } = await generateUploadUrl({
        organizationId: organization._id,
      });
      await uploadFile({ file, url, key });
      await authClient.organization.update({
        organizationId: organization._id,
        data: {
          logo: storageUrl,
        },
      });
    },
    onSuccess: () => {
      toast.success("Logo updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update logo", {
        description: error.message,
      });
    },
  });

  const fileWithPreview = files.at(0);
  const previewUrl = fileWithPreview?.preview || null;
  const displayUrl = previewUrl || organization.logo;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex w-full aspect-21/9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input">
        {displayUrl ? (
          <img
            alt="Upload preview"
            className="size-full object-contain p-4"
            src={displayUrl}
          />
        ) : (
          <div aria-hidden="true">
            <ImageIcon size={32} />
          </div>
        )}
      </div>
      <div className="relative inline-flex gap-2">
        <Button aria-haspopup="dialog" onClick={openFileDialog}>
          {previewUrl ? "Change image" : "Upload image"}
        </Button>
        {previewUrl && (
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              clearFiles();
            }}
          >
            Reset
          </Button>
        )}
        <Button
          className="ml-auto"
          disabled={!previewUrl || isPending}
          onClick={async () => {
            const file = fileWithPreview?.file as File;
            if (!file) {
              return;
            }
            updateLogo(file);
          }}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
        <input
          {...getInputProps()}
          aria-label="Upload image file"
          className="sr-only"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
