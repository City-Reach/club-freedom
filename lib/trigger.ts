import type { AnyTask, TaskIdentifier, TaskPayload } from "@trigger.dev/sdk";

export async function triggerTask<T extends AnyTask>(
  identifier: TaskIdentifier<T>,
  payload: TaskPayload<T>,
) {
  const url = `https://api.trigger.dev/api/v1/tasks/${identifier}/trigger`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payload,
    }),
  });
}
