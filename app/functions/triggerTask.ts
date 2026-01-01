import { createServerFn } from "@tanstack/react-start";
import { tasks } from "@trigger.dev/sdk";
import type { helloWorld } from "@/src/trigger/example";


export const triggerTaskServerFn = createServerFn()
    .inputValidator((data: { name: string }) => data)
    .handler(async ({ data }) => {
        const handle = await tasks.trigger<typeof helloWorld>("hello-world", {name: data.name});

    //return a success response with the handle
    return Response.json(handle);
});
