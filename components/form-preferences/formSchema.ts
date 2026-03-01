import z from "zod";
export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  textEnabled: z.boolean(),
  audioEnabled: z.boolean(),
  videoEnabled: z.boolean(),
  agreements: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .min(1)
    .max(3),
});
export type FormSchema = z.infer<typeof formSchema>;

export const defaultAgreement =
      "I agree that my personal information and testimonial may be processsed and published on this service.";