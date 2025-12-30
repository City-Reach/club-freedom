import { useTestimonialContext } from "@/contexts/testimonial-context";
import { Button } from "../ui/button";

export default function TestimonialTextDownload() {
  const { testimonial } = useTestimonialContext();

  const downloadTextFile = (text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `testimonial-${testimonial._creationTime}-${testimonial.name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Button
      onClick={() =>
        testimonial.testimonialText
          ? downloadTextFile(testimonial.testimonialText)
          : null
      }
      disabled={!testimonial.testimonialText}
    >
      {testimonial.storageId
        ? "Download Transcription"
        : "Download Testimonial"}
    </Button>
  );
}
