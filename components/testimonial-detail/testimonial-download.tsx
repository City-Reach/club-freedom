import { Link } from "@tanstack/react-router";
import {
  AudioLinesIcon,
  ChevronDown,
  DownloadIcon,
  FileText,
  VideoIcon,
} from "lucide-react";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const useTestimonialTextDownload = () => {
  const { testimonial } = useTestimonialContext();

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

  return {
    canDownload: !!testimonial.testimonialText,
    downloadTextFile,
  };
};

export default function TestimonialDownload() {
  const { testimonial } = useTestimonialContext();
  const { canDownload, downloadTextFile } = useTestimonialTextDownload();
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
          <DropdownMenuItem asChild>
            <Link
              to="/testimonials/$id/media-download"
              params={{ id: testimonial._id }}
            >
              {testimonial.media_type === "video" ? (
                <VideoIcon />
              ) : (
                <AudioLinesIcon />
              )}
              Download {testimonial.media_type === "video" ? "Video" : "Audio"}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled={!canDownload} onClick={downloadTextFile}>
          <FileText />
          Download {hasMedia ? "Trascription" : "Testimonial"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
