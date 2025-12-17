import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import useMobileDetect from "@/hooks/use-mobile-detect";
import { VideoRecorderGuard } from "./guards";
import { LoadingAudioRecorder, LoadingVideoRecorder } from "./loading";

const LazyDesktopVideoRecorder = lazy(() => import("./desktop-video-recorder"));
const LazyMobileVideoRecorder = lazy(() => import("./mobile-video-recorder"));
const LazyAudioRecorder = lazy(() => import("./audio-recorder"));

export function AudioRecorder() {
  return (
    <ClientOnly>
      <Suspense fallback={<LoadingAudioRecorder />}>
        <LazyAudioRecorder />
      </Suspense>
    </ClientOnly>
  );
}

function DesktopVideoRecorder() {
  return (
    <ClientOnly>
      <VideoRecorderGuard>
        <Suspense fallback={<LoadingVideoRecorder />}>
          <LazyDesktopVideoRecorder />
        </Suspense>
      </VideoRecorderGuard>
    </ClientOnly>
  );
}

function MobileVideoRecorder() {
  return (
    <ClientOnly>
      <VideoRecorderGuard>
        <Suspense fallback={<LoadingVideoRecorder />}>
          <LazyMobileVideoRecorder />
        </Suspense>
      </VideoRecorderGuard>
    </ClientOnly>
  );
}

export function VideoRecorder() {
  const isMobile = useMobileDetect();

  return isMobile ? <MobileVideoRecorder /> : <DesktopVideoRecorder />;
}
