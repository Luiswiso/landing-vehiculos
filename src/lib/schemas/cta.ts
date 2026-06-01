import { z } from "zod";

export const CtaConfigSchema = z.object({
  href: z.string().url().or(z.string().startsWith("mailto:")),
  label: z.string().min(3).max(60),
  description: z.string().min(5).max(200).optional(),
});

export type CtaConfig = z.infer<typeof CtaConfigSchema>;
