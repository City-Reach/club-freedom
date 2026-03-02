import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/o/$orgSlug/dashboard/form-preferences/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/o/$orgSlug/dashboard/form-preferences/$id"!</div>
}
