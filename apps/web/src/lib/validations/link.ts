import * as z from "zod";

export const ctaSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(100, "Message must be less than 100 characters"),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .max(30, "Button text must be less than 30 characters"),
  buttonUrl: z.string().url("Invalid URL"),
  position: z.enum(["top", "bottom"]),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex code"),
});

export const createLinkSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  cta: ctaSchema.optional(),
});

export type CreateLinkData = z.infer<typeof createLinkSchema>;
export type CTAData = z.infer<typeof ctaSchema>;
