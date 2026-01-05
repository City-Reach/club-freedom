import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { ClientOnly, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { triggerTaskServerFn } from "@/app/functions/triggerTask";
import { validateTurnstileTokenServerFn } from "@/app/functions/turnstile";
import { api } from "@/convex/_generated/api";
import { env } from "@/env/client";
import { useUploadFile } from "@/hooks/use-upload-file";
import { type Testimonial, testimonialSchema } from "@/lib/schema";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { AudioRecorder, VideoRecorder } from "./recorder";

export default function TestimonialForm() {
  const form = useForm<Testimonial>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", email: "", writtenText: "", consent: false },
  });
  const navigation = useNavigate();
  const uploadFile = useUploadFile();
  const generateUploadUrl = useConvexMutation(
    api.uploadTempFile.generateTempUploadUrl,
  );
  const postTestimonial = useMutation(api.testimonials.postTestimonial);
  const validateTurnstileToken = useServerFn(validateTurnstileTokenServerFn);
  const triggerTask = useServerFn(triggerTaskServerFn);

  const [tabValue, setTabValue] = useState("video");

  const handleTabChange = (value: string) => {
    setTabValue(value);
    form.resetField("mediaFile");
    form.resetField("writtenText");
  };

  const canSwitchTab =
    form.watch("mediaFile") == null && form.watch("writtenText") === "";

  async function onSubmit(values: Testimonial) {
    try {
      // Step 1: Validate Turnstile token
      const turnstileToken = values.turnstileToken;
      const isHuman = await validateTurnstileToken({
        data: { turnstileToken },
      });
      if (!isHuman) {
        throw new Error("Human verification failed");
      }

      // Step 2:
      let storageId: string | undefined;
      let media_type = "text";
      if (values.mediaFile) {
        const { url, key } = await generateUploadUrl();
        if (!key) {
          throw new Error("Failed to generate media key");
        }
        await uploadFile({ file: values.mediaFile, url, key });
        storageId = key;
        if (values.mediaFile.type.startsWith("audio")) {
          media_type = "audio";
        } else if (values.mediaFile.type.startsWith("video")) {
          media_type = "video";
        }
      }

      // Step 3: Save testimonial data with storage ID
      const id = await postTestimonial({
        name: values.name,
        email: values.email ? values.email : undefined,
        storageId: storageId,
        media_type: media_type,
        text: values.writtenText,
      });

      //Step 4: trigger media processing task if media file exists
      if (storageId) {
        triggerTask({
          data: {
            testimonialId: id,
            mediaKey: storageId,
          },
        });
      }

      toast.success("Testimonial submitted successfully!", {
        description: "Thank you for your submission.",
      });
      form.reset();
      navigation({ to: "/testimonials/$id", params: { id } });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to submit testimonial", {
        description: message,
      });
    }
  }

  return (
    <FormProvider {...form}>
      <div className="w-full max-w-lg">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  placeholder="Jane"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-baseline"
                >
                  Email <small>(optional)</small>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="name@example.com"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Tabs
            className="w-full"
            value={tabValue}
            onValueChange={handleTabChange}
          >
            <TabsList>
              <TabsTrigger value="video" disabled={!canSwitchTab}>
                Video
              </TabsTrigger>
              <TabsTrigger value="audio" disabled={!canSwitchTab}>
                Audio
              </TabsTrigger>
              <TabsTrigger value="text" disabled={!canSwitchTab}>
                Text
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <Controller
                control={form.control}
                name="writtenText"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Written Testimonial
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Start typing..."
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </TabsContent>
            <TabsContent value="audio">
              <Controller
                control={form.control}
                name="mediaFile"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Audio Testimonial
                    </FieldLabel>
                    <FieldDescription>
                      Please find a quiet place to record your audio
                      testimonial.
                    </FieldDescription>
                    <ClientOnly>
                      <AudioRecorder />
                    </ClientOnly>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </TabsContent>
            <TabsContent value="video">
              <Controller
                control={form.control}
                name="mediaFile"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Video Testimonial
                    </FieldLabel>
                    <FieldDescription>
                      Please find a quiet place to record your video
                      testimonial.
                    </FieldDescription>
                    <ClientOnly>
                      <VideoRecorder />
                    </ClientOnly>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </TabsContent>
          </Tabs>

          <Controller
            control={form.control}
            name="consent"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="horizontal">
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    I agree that my personal information and testimonial may be
                    processsed and published on the Club Freedom service.
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="turnstileToken"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Turnstile
                  siteKey={env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={(token: string) => field.onChange(token)}
                  onExpire={() => field.onChange("")}
                  options={{ size: "flexible" }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
}
