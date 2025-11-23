import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@tanstack/react-router";
import { getApprovalStatusText } from "@/utils/testimonial-utils";
import { isModOrAdmin } from "@/convex/lib/permissions";

type Props = {
  id: Id<"testimonials">;
};

export default function TestimonialDetail({ id }: Props) {
  const testimonial = useQuery(api.testimonials.getTestimonialById, { id });
  const user = useQuery(api.auth.getCurrentUser);
  const updateTestimonialApproval = useMutation(
    api.testimonials.updateTestimonialApproval
  );
  
  if (!testimonial) {
    return <div>Loading testimonial...</div>;
  }
  
  const approvalText = getApprovalStatusText(testimonial.approved);
  const downloadTranscription = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [testimonial.testimonialText || "Transcription not available."],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${testimonial.name}-${testimonial._creationTime}-transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleApprovalOrDisapproval = async (approved: boolean) => {
    await updateTestimonialApproval({ id, approved });
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">{testimonial.name}'s Testimonial</h1>
      {testimonial.mediaUrl && testimonial.media_type == "audio" && (
        <audio className="w-full" controls src={testimonial.mediaUrl} />
      )}
      {testimonial.mediaUrl && testimonial.media_type == "video" && (
        <video className="w-full" controls src={testimonial.mediaUrl} />
      )}
      <div className="flex gap-2">
        {testimonial.mediaUrl && (
          <Button asChild>
            <Link
              to="/testimonials/$id/media-download"
              params={{ id }}
              target="_blank"
            >
              Download {testimonial.media_type == "audio" ? "Audio" : "Video"}
            </Link>
          </Button>
        )}
        <Button
          onClick={downloadTranscription}
          disabled={!testimonial.testimonialText}
        >
          {testimonial.media_id
            ? "Download Transcription"
            : "Download Testimonial"}
        </Button>
      </div>
      {isModOrAdmin(user?.role) && <p>{approvalText}</p>}
      <div className="space-y-1">
        <h3 className="font-bold">Posted by {testimonial.name}</h3>
        <p className="font-mono text-muted-foreground">
          {testimonial._creationTime
            ? formatDistance(testimonial._creationTime, Date.now(), {
                addSuffix: true,
              })
            : "Date not available"}
        </p>
      </div>
      <div className="space-y-0">
        <h3 className="font-bold flex items-center gap-1.5">
          Summary{!testimonial.summary && <Spinner></Spinner>}
        </h3>

        {testimonial.summary ? (
          <p>{testimonial.summary}</p>
        ) : (
          <p className="text-muted-foreground">
            Summary will be available soon.
          </p>
        )}
      </div>
      <div>
        <h3 className="font-bold flex items-center gap-1.5">
          {testimonial.media_id ? "Transcription" : "Testimonial"}
          {!testimonial.testimonialText && <Spinner></Spinner>}
        </h3>

        {testimonial.testimonialText ? (
          <p>{testimonial.testimonialText}</p>
        ) : (
          <p className="text-muted-foreground">
            Transcription will be available soon.
          </p>
        )}
      </div>
      {(user?.role === "admin" || user?.role === "moderator") && (
        <div className="flex gap-2">
          <Button
            className="bg-green-600 cursor-pointer"
            onClick={() => handleApprovalOrDisapproval(true)}
          >
            Approve
          </Button>
          <Button
            className="bg-red-600 cursor-pointer"
            onClick={() => handleApprovalOrDisapproval(false)}
          >
            Disapprove
          </Button>
        </div>
      )}
    </div>
  );
}
