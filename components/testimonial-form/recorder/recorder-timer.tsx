import react from "react";
import { Badge } from "@/components/ui/badge";
import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

type Props = {
  limit: number;
  isRecording: boolean;
  onTimeout: () => void;
} & react.ComponentProps<typeof Badge>;

export default function RecorderTimer({
  limit,
  isRecording,
  onTimeout,
  className,
  ...props
}: Props) {
  const [remaining, { startCountdown, resetCountdown }] = useCountdown({
    countStart: limit,
    intervalMs: 1000,
  });

  react.useEffect(() => {
    if (isRecording) {
      resetCountdown();
      startCountdown();
    }
    return () => {
      resetCountdown();
    };
  }, [isRecording, startCountdown, resetCountdown]);

  react.useEffect(() => {
    if (remaining === 0) {
      onTimeout();
    }
  }, [remaining, onTimeout]);

  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");

  return (
    <Badge
      variant="destructive"
      className={cn("font-mono", className)}
      {...props}
    >
      {mins}:{secs}
    </Badge>
  );
}
