import { useRouteContext } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "../ui/button";

export default function OrganizationLogoForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const [{ files }, { clearFiles, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const previewUrl = files[0]?.preview || null;

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
        <Button className="ml-auto" disabled={!previewUrl}>
          Save
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
