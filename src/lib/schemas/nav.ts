import { z } from "zod";

export const NavLinkSchema = z.object({
  href: z.string().startsWith("/"),
  label: z.string().min(1).max(40),
});

export const NavPropsSchema = z.object({
  links: z.array(NavLinkSchema).min(1),
  currentPath: z.string().startsWith("/"),
});

export type NavLink = z.infer<typeof NavLinkSchema>;
export type NavProps = z.infer<typeof NavPropsSchema>;
