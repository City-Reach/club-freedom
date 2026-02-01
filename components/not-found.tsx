import { Link } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-3">
          <Button variant="default" onClick={() => window.history.back()}>
            <ArrowLeft />
            Go back
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <Home />
              Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
