import AuthLayout from "@/components/layouts/auth-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/invitation/$id")({
  component: RouteComponent,
  loader: async ({}) => {},
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <AuthLayout>Hello</AuthLayout>;
}
