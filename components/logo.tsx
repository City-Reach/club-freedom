import { Link } from "@tanstack/react-router";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";

type Props = {
  organization?: Doc<"organization"> | undefined;
};
export default function Logo({ organization }: Props) {
  let link = `/`;
  if (organization?.slug) {
    link = `/o/${organization.slug}`;
  }
  return (
    <Link to={link} className="flex h-16 items-center justify-center">
      <img
        className="h-10"
        src="/city_reach_logo.svg"
        alt="city-reach-logo"
      ></img>
    </Link>
  );
}
