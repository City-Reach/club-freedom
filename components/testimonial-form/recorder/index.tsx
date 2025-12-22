import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import useMobileDetect from "@/hooks/use-mobile-detect";
import { getVideoConfig } from "@/lib/media";
import { UnsupportedVideo } from "./error";
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

export function VideoRecorder() {
  const isMobile = useMobileDetect();
  const config = getVideoConfig();

  if (!config) {
    return <UnsupportedVideo />;
  }

  return (
    <ClientOnly>
      <Suspense fallback={<LoadingVideoRecorder />}>
        {isMobile ? (
          <LazyMobileVideoRecorder {...config} />
        ) : (
          <LazyDesktopVideoRecorder {...config} />
        )}
      </Suspense>
    </ClientOnly>
  );
}
