import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useUploadFile } from "@convex-dev/r2/react";
import useMobileDetect from "@/hooks/use-mobile-detect";
import MobileVideoRecorder from "../recorder/mobile-video-recorder";
import { Testimonial, testimonialSchema } from "@/lib/schema/testimonials";
import { useNavigate } from "@tanstack/react-router";
import { AudioRecorder, VideoRecorder } from "../recorder";
import { Turnstile } from "@marsidev/react-turnstile";
import React from "react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldContent,
} from "../ui/field";
import { useServerFn } from "@tanstack/react-start";
import { validateTurnstileTokenServerFn } from "@/app/functions/turnstile";

export default function TestimonialForm() {
  const form = useForm<Testimonial>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", email: "", writtenText: "", consent: false },
  });
  const navigation = useNavigate();
  const uploadFile = useUploadFile(api.r2);
  const isMobile = useMobileDetect();
  const postTestimonial = useMutation(api.testimonials.postTestimonial);
  const validateTurnstileToken = useServerFn(validateTurnstileTokenServerFn);

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
        toast.error("Human verification failed. Please try again.");
        return;
      }

      // Step 2:
      let storageId: string | undefined = undefined;
      let media_type = "text";
      if (values.mediaFile) {
        storageId = await uploadFile(values.mediaFile);
        if (!storageId) {
          throw new Error("Failed to upload audio file");
        }
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

      toast.success("Testimonial submitted successfully!", {
        description: "Thank you for your submission.",
      });
      form.reset();
      navigation({ to: "/testimonials/$id", params: { id } });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit testimonial", {
        description: "Please try again later.",
      });
    }
  }

  return (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="flex items-baseline">
                Email <small>(optional)</small>
              </FieldLabel>
              <Input
                {...field}
                placeholder="name@example.com"
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                    Please find a quiet place to record your audio testimonial.
                  </FieldDescription>
                  <AudioRecorder
                    onRecordingComplete={(mediaFile) => {
                      field.onChange(mediaFile);
                    }}
                  />
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
                    Please find a quiet place to record your video testimonial.
                  </FieldDescription>
                  {isMobile ? (
                    <MobileVideoRecorder field={field} />
                  ) : (
                    <VideoRecorder
                      onRecordingComplete={(videoFile) => {
                        field.onChange(videoFile);
                      }}
                    />
                  )}
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
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onSuccess={(token: string) => field.onChange(token)}
                onExpire={() => field.onChange("")}
                options={{ size: "flexible" }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner />}
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
