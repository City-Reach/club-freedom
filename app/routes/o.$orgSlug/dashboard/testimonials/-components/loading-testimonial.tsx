import { Empty, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingTestimonial() {
  return (
    <Empty>
      <EmptyMedia>
        <Spinner className="size-8" />
      </EmptyMedia>
      <EmptyTitle>Loading testimonial...</EmptyTitle>
    </Empty>
  );
}
