import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  ClientOnly,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "convex/react";
import { formatDistance } from "date-fns";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { validateTurnstileTokenServerFn } from "@/app/functions/turnstile";
import {
  AudioRecorder,
  VideoRecorder,
} from "@/components/testimonial-form/recorder/index";
import TestimonialFormBlocker from "@/components/testimonial-form/testimonial-form-blocker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { env } from "@/env/client";
import { useBackgroundMediaUpload } from "@/hooks/use-background-media-upload";
import {
  AUDIO_RECORDING_TIME_LIMIT_IN_SECONDS,
  VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS,
} from "@/lib/media";
import { type Testimonial, testimonialSchema } from "@/lib/schema/testimonials";

export default function TestimonialForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const form = useForm<Testimonial>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      email: "",
      writtenText: "",
      consent: false,
      turnstileToken: "",
    },
  });
  const navigation = useNavigate();
  const postTestimonial = useMutation(api.testimonials.postTestimonial);
  const validateTurnstileToken = useServerFn(validateTurnstileTokenServerFn);
  const { uploadMedia } = useBackgroundMediaUpload();
  const [tabValue, setTabValue] = useState("video");

  const handleTabChange = (value: string) => {
    setTabValue(value);
    form.resetField("media");
    form.resetField("writtenText");
  };

  const canSwitchTab =
    form.watch("media") == null && form.watch("writtenText") === "";

  async function onSubmit(values: Testimonial) {
    try {
      // Step 1: Human verification
      const turnstileToken = values.turnstileToken;
      const isHuman = await validateTurnstileToken({
        data: { turnstileToken },
      });
      if (!isHuman) {
        throw new Error("Human verification failed");
      }

      // Step 2: Save testimonial data
      const media_type = values.media?.type?.startsWith("audio")
        ? "audio"
        : values.media?.type?.startsWith("video")
          ? "video"
          : "text";

      const testimonialId = await postTestimonial({
        name: values.name,
        email: values.email ? values.email : undefined,
        media_type,
        text: values.writtenText,
        organizationId: organization._id as string,
      });

      // Step 3: Upload to offline database
      if (values.media) {
        uploadMedia(testimonialId, {
          blob: values.media,
          organizationId: organization._id as string,
          status: "pending",
        });
      }

      form.reset();
      toast.success("Testimonial submitted successfully!", {
        description: "Thank you for your submission.",
      });

      await navigation({
        to: "/o/$orgSlug/testimonials/tmp/$id",
        params: { orgSlug: organization.slug, id: testimonialId },
      });
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
      <TestimonialFormBlocker />
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
                name="media"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Audio Testimonial
                    </FieldLabel>
                    <FieldDescription>
                      Please find a quiet place to record your audio
                      testimonial.
                    </FieldDescription>
                    <FieldDescription>
                      Time limit:{" "}
                      <strong>
                        {formatDistance(
                          0,
                          AUDIO_RECORDING_TIME_LIMIT_IN_SECONDS * 1000,
                        )}
                      </strong>
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
                name="media"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Video Testimonial
                    </FieldLabel>
                    <FieldDescription>
                      Please find a quiet place to record your video
                      testimonial.
                    </FieldDescription>
                    <FieldDescription>
                      Time limit:{" "}
                      <strong>
                        {formatDistance(
                          0,
                          VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS * 1000,
                        )}
                      </strong>
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
                  onSuccess={(token) => field.onChange(token)}
                  onExpire={() => form.resetField("turnstileToken")}
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
