import type { InferUserFromClient } from "better-auth";
import type { authClientOption } from "./auth-client";

export type User = InferUserFromClient<typeof authClientOption>;
