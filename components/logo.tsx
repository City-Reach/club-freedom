import { Link, useParams } from "@tanstack/react-router";

export default function Logo() {
  const { orgSlug = "" } = useParams({ strict: false })
  let link = `/${orgSlug}`
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
