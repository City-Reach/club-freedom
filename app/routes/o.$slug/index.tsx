import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/o/$slug/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/o/$slug/"!</div>
}
