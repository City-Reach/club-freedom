import { Link } from "@tanstack/react-router";

export default function Logo() {
  return (
    <Link to="/" className="flex h-16 items-center justify-center">
      <img
        className="h-10"
        src="/city_reach_logo.svg"
        alt="city-reach-logo"
      ></img>
    </Link>
  );
}
