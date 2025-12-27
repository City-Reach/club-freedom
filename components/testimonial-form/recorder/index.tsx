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
    <Suspense fallback={<LoadingAudioRecorder />}>
      <LazyAudioRecorder />
    </Suspense>
  );
}

export function VideoRecorder() {
  const isMobile = useMobileDetect();
  const config = getVideoConfig();

  if (!config) {
    return <UnsupportedVideo />;
  }

  return (
    <Suspense fallback={<LoadingVideoRecorder />}>
      {isMobile ? (
        <LazyMobileVideoRecorder {...config} />
      ) : (
        <LazyDesktopVideoRecorder {...config} />
      )}
    </Suspense>
  );
}
