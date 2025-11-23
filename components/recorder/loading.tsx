import { Mic, Video } from "lucide-react";
import { Button } from "../ui/button";

export function LoadingAudioRecorder() {
  return (
    <div className="flex flex-col p-4 border items-center rounded-lg gap-4">
      <Button size="icon" className="size-12 rounded-full" disabled>
        <Mic className="size-6" />
      </Button>
      <div className="text-sm font-medium">Loading recorder...</div>
    </div>
  );
}

export function LoadingVideoRecorder() {
  return (
    <div className="flex flex-col p-4 border items-center rounded-lg gap-4">
      <Button size="icon" className="size-12 rounded-full" disabled>
        <Video className="size-6" />
      </Button>
      <div className="text-sm font-medium">Loading recorder...</div>
    </div>
  );
}
