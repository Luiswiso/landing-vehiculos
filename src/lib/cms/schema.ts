import { z } from "zod";

export const PartnerSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Must be a URL-safe slug"),
  name: z.string().min(1),
  logoUrl: z.string().min(1),
  altText: z.string().min(1),
});

export const LandingStatsSchema = z.object({
  numVehiculos: z.number().int().positive(),
  numBays: z.number().int().positive(),
  numTechs: z.number().int().positive(),
  uptimeRate: z.number().min(0).max(100),
  coberturaKm: z.number().int().positive(),
  partners: z.array(PartnerSchema).min(1),
});

export type Partner = z.infer<typeof PartnerSchema>;
export type LandingStats = z.infer<typeof LandingStatsSchema>;

export class LandingStatsValidationError extends Error {
  constructor(public issues: z.ZodIssue[]) {
    super(
      `Landing stats failed validation: ${issues.map((i) => i.message).join(", ")}`,
    );
    this.name = "LandingStatsValidationError";
  }
}
