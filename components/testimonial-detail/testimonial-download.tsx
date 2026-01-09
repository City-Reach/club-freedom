import { useAction } from "convex/react";
import {
  AudioLinesIcon,
  ChevronDown,
  DownloadIcon,
  FileText,
  VideoIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const useTestimonialDownload = () => {
  const { testimonial } = useTestimonialContext();
  const generateDownloadMedia = useAction(api.media.generateMediaDownloadUrl);

  const downloadTextFile = () => {
    if (!testimonial.testimonialText) return;

    const element = document.createElement("a");
    const file = new Blob([testimonial.testimonialText], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `testimonial-${testimonial._creationTime}-${testimonial.name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadMedia = async () => {
    const downloadURL = await generateDownloadMedia({ id: testimonial._id });
    if (!downloadURL) {
      toast.error("Media download failed");
      return;
    }

    // Create a temporary anchor element to trigger download
    const element = document.createElement("a");
    element.href = downloadURL;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return {
    canDownload: !!testimonial.testimonialText,
    downloadTextFile,
    downloadMedia,
  };
};

export default function TestimonialDownload() {
  const { testimonial } = useTestimonialContext();
  const { canDownload, downloadTextFile, downloadMedia } =
    useTestimonialDownload();
  const hasMedia = testimonial.storageId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <DownloadIcon /> Download <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {hasMedia !== "text" && (
          <DropdownMenuItem onClick={downloadMedia} className="cursor-pointer">
            {testimonial.media_type === "video" ? (
              <VideoIcon />
            ) : (
              <AudioLinesIcon />
            )}
            Download {testimonial.media_type === "video" ? "Video" : "Audio"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          disabled={!canDownload}
          onClick={downloadTextFile}
          className="cursor-pointer"
        >
          <FileText />
          Download {hasMedia ? "Trascription" : "Testimonial"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
