import { z } from "zod";

/**
 * SeoPropsSchema — validates all SEO props passed to Base.astro.
 * Satisfies: T-040, design §7.1
 */
export const SeoPropsSchema = z.object({
  /** Page title — max 60 chars, must include brand anchor */
  title: z
    .string()
    .min(5)
    .max(60)
    .refine((t) => t.includes("Flota Pesada") || t.includes("flota pesada"), {
      message:
        "Title must reference 'Flota Pesada' per brand anchor constraint (design §7.1)",
    }),

  /** Meta description — max 155 chars */
  description: z.string().min(10).max(155),

  /** Canonical URL — must be absolute */
  canonicalUrl: z.string().url(),

  /** OpenGraph image URL — relative path or absolute URL */
  ogImage: z.string().min(1),
});

export type SeoProps = z.infer<typeof SeoPropsSchema>;
