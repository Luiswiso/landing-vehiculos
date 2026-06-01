import { z } from "zod";
import { PartnerSchema } from "../cms/schema";

export const PartnersShowcasePropsSchema = z.object({
  partners: z.array(PartnerSchema).min(0),
  heading: z.string().min(1).max(80).default("Nuestros Partners"),
});

export type PartnersShowcaseProps = z.infer<typeof PartnersShowcasePropsSchema>;
