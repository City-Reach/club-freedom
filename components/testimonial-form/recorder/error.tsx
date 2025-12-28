import { CameraOff } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function UnsupportedVideo() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CameraOff />
        </EmptyMedia>
        <EmptyTitle>Your browser does not support video recording</EmptyTitle>
        <EmptyDescription>
          Please try using a different browser or device. Alternatively, you can
          record testimonials.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
