import { z } from "zod";

export const CtaLinkSchema = z.object({
  href: z.string().url().or(z.string().startsWith("mailto:")),
  label: z.string().min(3).max(60),
});

export const HeroPropsSchema = z.object({
  headline: z.string().min(5).max(100),
  // content rule: <= 30 words enforced at build/test time
  subtitle: z.string().min(5).max(200),
  cta: CtaLinkSchema,
  image: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
});

export type CtaLink = z.infer<typeof CtaLinkSchema>;
export type HeroProps = z.infer<typeof HeroPropsSchema>;
