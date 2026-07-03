import { z } from "zod";

const optionalEnvString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: optionalEnvString,
  GEMINI_API_KEY: optionalEnvString,
  GEMINI_TEXT_MODEL: z.string().default("gemini-3.5-flash"),
  GEMINI_IMAGE_MODEL: z.string().default("gemini-3.1-flash-image"),
  OPENWEATHER_API_KEY: optionalEnvString,
  OPENWEATHER_DEFAULT_CITY: z.string().default("Seoul"),
  OPENWEATHER_DEFAULT_COUNTRY: z.string().default("KR"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalEnvString,
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

export const serverEnv = serverEnvSchema.parse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_TEXT_MODEL: process.env.GEMINI_TEXT_MODEL,
  GEMINI_IMAGE_MODEL: process.env.GEMINI_IMAGE_MODEL,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  OPENWEATHER_DEFAULT_CITY: process.env.OPENWEATHER_DEFAULT_CITY,
  OPENWEATHER_DEFAULT_COUNTRY: process.env.OPENWEATHER_DEFAULT_COUNTRY,
});

export function requireEnv<T>(value: T | undefined, name: string): T {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
