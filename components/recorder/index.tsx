import { ComponentProps, lazy, Suspense } from "react";
import { LoadingAudioRecorder, LoadingVideoRecorder } from "./loading";
import { ClientOnly } from "@tanstack/react-router";

const LazyVideoRecorder = lazy(() => import("./video-recorder"));
const LazyAudioRecorder = lazy(() => import("./audio-recorder"));

export function AudioRecorder({
  onRecordingComplete,
}: ComponentProps<typeof LazyAudioRecorder>) {
  return (
    <ClientOnly>
      <Suspense fallback={<LoadingAudioRecorder />}>
        <LazyAudioRecorder onRecordingComplete={onRecordingComplete} />
      </Suspense>
    </ClientOnly>
  );
}

export function VideoRecorder({
  onRecordingComplete,
}: ComponentProps<typeof LazyVideoRecorder>) {
  return (
    <ClientOnly>
      <Suspense fallback={<LoadingVideoRecorder />}>
        <LazyVideoRecorder onRecordingComplete={onRecordingComplete} />
      </Suspense>
    </ClientOnly>
  );
}
