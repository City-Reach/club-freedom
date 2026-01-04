import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "convex/react";
import { formatDistance } from "date-fns";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { triggerTaskServerFn } from "@/app/functions/triggerTask";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getApprovalStatusText } from "@/utils/testimonial-utils";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

type Props = {
  id: Id<"testimonials">;
};

export default function TestimonialDetail({ id }: Props) {
  const testimonial = useQuery(api.testimonials.getTestimonialById, { id });
  const triggerTask = useServerFn(triggerTaskServerFn);
  const userCanApprove = useQuery(api.auth.checkUserPermissions, {
    permissions: {
      testimonial: ["approve"],
    },
  });

  const updateTestimonialApproval = useMutation(
    api.testimonials.updateTestimonialApproval,
  );

  const updateTestimonial = useMutation(api.testimonials.updateTestimonial);
  const retrySummarizing = useMutation(api.testimonials.retrySummarizing);

  async function retryProcessing({ id }: { id: Id<"testimonials"> }) {
    await updateTestimonial({ _id: id, processingStatus: "ongoing" });
    if (testimonial && testimonial.storageId) {
      await triggerTask({
        data: {
          testimonialId: id,
          mediaKey: testimonial?.storageId,
        },
      });
    }
    await retrySummarizing({ id });
  }

  if (!testimonial) {
    return <div>Loading testimonial...</div>;
  }

  const approvalText = getApprovalStatusText(testimonial.approved);
  const canApprove =
    testimonial.processingStatus === "completed" && userCanApprove;

  const downloadTranscription = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [testimonial.testimonialText || "Transcription not available."],
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = `${testimonial.name}-${testimonial._creationTime}-transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleApprovalOrDisapproval = async (approved: boolean) => {
    try {
      await updateTestimonialApproval({ id, approved });
    } catch (_err) {
      toast.error("Failed to update testimonial approval");
    }
  };

  const title = testimonial.title || `Testimonial from ${testimonial.name}`;

  return (
    <div className="flex flex-col gap-8">
      {testimonial.processingStatus === "error" && (
        <Item variant="outline" size="sm">
          <ItemMedia className="text-destructive">
            <AlertCircle className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              Failed to process testimonial.
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => retryProcessing({ id })}
            >
              Try again
            </Button>
          </ItemActions>
        </Item>
      )}
      <h1 className="text-2xl font-bold">
        {title}
        {!testimonial.title && testimonial.processingStatus === "ongoing" && (
          <Spinner className="inline align-baseline size-5 ml-1" />
        )}
      </h1>
      {testimonial.mediaUrl && testimonial.media_type === "audio" && (
        <audio className="w-full" controls src={testimonial.mediaUrl} />
      )}
      {testimonial.mediaUrl && testimonial.media_type === "video" && (
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
              Download {testimonial.media_type === "audio" ? "Audio" : "Video"}
            </Link>
          </Button>
        )}
        <Button
          onClick={downloadTranscription}
          disabled={!testimonial.testimonialText}
        >
          {testimonial.storageId
            ? "Download Transcription"
            : "Download Testimonial"}
        </Button>
      </div>
      {canApprove && <p>{approvalText}</p>}
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
          Summary{" "}
          {!testimonial.summary &&
            testimonial.processingStatus === "ongoing" && <Spinner />}
        </h3>

        {testimonial.summary ? (
          <p>{testimonial.summary}</p>
        ) : testimonial.processingStatus === "ongoing" ? (
          <p className="text-muted-foreground">
            Summary will be available soon.
          </p>
        ) : (
          <p className="text-destructive">Summary not available.</p>
        )}
      </div>
      <div>
        <h3 className="font-bold flex items-center gap-1.5">
          {testimonial.storageId ? "Transcription" : "Testimonial"}
          {!testimonial.testimonialText &&
            testimonial.processingStatus === "ongoing" && <Spinner />}
        </h3>

        {testimonial.testimonialText ? (
          <p>{testimonial.testimonialText}</p>
        ) : testimonial.processingStatus === "ongoing" ? (
          <p className="text-muted-foreground">
            Transcription will be available soon.
          </p>
        ) : (
          <p className="text-destructive">Transcription not available.</p>
        )}
      </div>

      {canApprove && (
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
