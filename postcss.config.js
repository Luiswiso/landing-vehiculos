// Local PostCSS config — takes precedence over global C:\.postcssrc.json
// Tailwind CSS 4 uses @tailwindcss/postcss (or the Vite plugin — both are supported)
import tailwindcss from "@tailwindcss/postcss";

export default {
  plugins: [tailwindcss],
};
