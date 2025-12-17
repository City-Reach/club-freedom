import { Mic, Square } from "lucide-react";
import { useController } from "react-hook-form";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/schema";
import TimeElapsed from "./time-elapsed";

export default function AudioRecorder() {
  const { field } = useController<Testimonial>({
    name: "mediaFile",
  });
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    error,
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: {
      type: "audio/webm",
    },
    mediaRecorderOptions: {
      mimeType: "audio/webm",
    },
    onStop: (_, blob) => {
      const audioFile = new File([blob], `audio-recording-${Date.now()}`, {
        type: blob.type,
      });
      field.onChange(audioFile);
    },
  });

  if (status === "permission_denied" || error) {
    return (
      <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
        <div className="text-center text-destructive">
          <p className="font-semibold">
            Microphone access denied or unavailable
          </p>
          <p className="text-sm mt-2">
            {window.location.protocol === "http:" &&
            !window.location.hostname.includes("localhost")
              ? "Camera access requires HTTPS or localhost. Try accessing via localhost or enable HTTPS."
              : "Please allow camera access and try again."}
          </p>
        </div>
      </div>
    );
  }

  const isRecording = status === "recording";

  return (
    <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
      {/* Audio Preview */}
      {!isRecording && mediaBlobUrl && (
        <audio
          src={mediaBlobUrl}
          controls
          controlsList="nodownload"
          className="w-full object-cover"
        />
      )}

      {isRecording && <TimeElapsed isRecording={isRecording} />}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isRecording && (
          <Button
            size="icon"
            className="size-12 rounded-full"
            type="button"
            onClick={startRecording}
          >
            <Mic className="size-6" />
          </Button>
        )}
        {isRecording && (
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

        {mediaBlobUrl && !isRecording && (
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
    </div>
  );
}
