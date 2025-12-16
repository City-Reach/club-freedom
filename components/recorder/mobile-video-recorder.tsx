import { Square, Video } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import type { Testimonial } from "@/lib/schema";
import { Button } from "../ui/button";
import { useReactMediaRecorder } from "react-media-recorder";
import TimeElapsed from "./time-elapsed";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

type Props = {
  field: ControllerRenderProps<Testimonial, "mediaFile">;
};

export default function MobileVideoRecorder({ field }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const mp4Supported = MediaRecorder.isTypeSupported("video/mp4");
  const {
    startRecording,
    stopRecording,
    clearBlobUrl,
    status,
    mediaBlobUrl,
    previewStream,
  } = useReactMediaRecorder({
    video: {
      width: 1280,
      height: 720,
      facingMode: "user",
    },
    audio: true,
    blobPropertyBag: {
      type: mp4Supported ? "video/mp4" : "video/webm",
    },
    mediaRecorderOptions: {
      mimeType: mp4Supported ? "video/mp4" : "video/webm",
    },
    onStop: (_, blob) => {
      const videoFile = new File([blob], `video-recording-${Date.now()}`, {
        type: blob.type ?? "video/webm",
      });
      field.onChange(videoFile);
      setIsOpen(false);
    },
  });

  const isRecording = status === "recording";

  return (
    <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
      {!isRecording && mediaBlobUrl && (
        <video controls src={mediaBlobUrl} className="w-full" />
      )}
      <div className="flex items-center gap-3">
        <Button type="button" onClick={() => setIsOpen(true)}>
          Open camera
        </Button>
        {mediaBlobUrl && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              clearBlobUrl();
              field.onChange(undefined);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="rounded-none max-w-screen h-screen px-0">
          <div className="relative">
            <AlertDialogHeader className="p-6 bg-foreground/80 text-background absolute top-0 inset-x-0 z-20">
              <AlertDialogDescription>
                Please record your testimonial video. Make sure you are in a
                quiet environment with good lighting.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="absolute inset-0">
              {isRecording && previewStream ? (
                <div className="relative mt-auto">
                  <video
                    autoPlay
                    ref={(ref) => {
                      if (ref) {
                        ref.srcObject = previewStream;
                      }
                    }}
                    muted
                    playsInline
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="bg-black aspect-9/16 w-full mt-auto"></div>
              )}
            </div>
            <AlertDialogFooter className="flex flex-row items-center justify-between absolute bottom-0 left-0 right-0 z-20 p-6 bg-foreground/80 text-background">
              <TimeElapsed isRecording={isRecording} />
              {!isRecording ? (
                <Button
                  size="icon"
                  className="size-12 rounded-full"
                  type="button"
                  onClick={startRecording}
                >
                  <Video className="size-6" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  className="size-12 rounded-full"
                  variant="destructive"
                  type="button"
                  onClick={stopRecording}
                >
                  <Square className="size-6" />
                </Button>
              )}
              <AlertDialogCancel asChild disabled={isRecording}>
                <Button variant="ghost">Close</Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
