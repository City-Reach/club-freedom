import { type ReactNode, useEffect, useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { LoadingAudioRecorder, LoadingVideoRecorder } from "./loading";

type Props = {
  children: ReactNode;
};

export default function AudioRecorderGuard({ children }: Props) {
  const [support, setSupport] = useState<boolean | undefined>();

  useEffect(() => {
    setSupport("AudioEncoder" in window);
  }, []);

  if (support === undefined) return <LoadingAudioRecorder />;
  if (support) return children;
  else
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Not Supported</EmptyTitle>
          <EmptyDescription>
            Your browser does not support audio encoding. Please try using a
            different browser.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
}

export function VideoRecorderGuard({ children }: Props) {
  const [support, setSupport] = useState<boolean | undefined>();

  useEffect(() => {
    setSupport("VideoEncoder" in window);
  }, []);

  if (support === undefined) return <LoadingVideoRecorder />;
  if (support) return children;
  else
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Not Supported</EmptyTitle>
          <EmptyDescription>
            Your browser does not support video encoding. Please try using a
            different browser.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
}
