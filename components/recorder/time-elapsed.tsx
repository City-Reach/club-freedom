"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function TimeElapsed({
  isRecording,
  className,
}: {
  isRecording: boolean;
  className?: string;
}) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (isRecording) {
      setElapsed(0);
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const mins = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");

  return (
    <Badge variant="destructive" className={cn("font-mono", className)}>
      {mins}:{secs}
    </Badge>
  );
}
