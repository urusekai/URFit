import { GoogleGenAI } from "@google/genai";
import { requireEnv, serverEnv } from "@/lib/env";

export type GenerateTextOptions = {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
};

export type GenerateImageOptions = {
  prompt: string;
  imageSize?: "512" | "1K" | "2K" | "4K";
};

export type GenerateImageResult = {
  text?: string;
  image?: {
    data: string;
    mimeType: string;
  };
};

function getClient() {
  return new GoogleGenAI({
    apiKey: requireEnv(serverEnv.GEMINI_API_KEY, "GEMINI_API_KEY"),
  });
}

export async function generateText({
  prompt,
  systemInstruction,
  temperature = 0.7,
}: GenerateTextOptions) {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: serverEnv.GEMINI_TEXT_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      temperature,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini API returned an empty response.");
  }

  return text;
}

export async function generateImage({
  prompt,
  imageSize = "1K",
}: GenerateImageOptions): Promise<GenerateImageResult> {
  const ai = getClient();
  const interaction = await ai.interactions.create({
    model: serverEnv.GEMINI_IMAGE_MODEL,
    input: prompt,
    generation_config: {
      temperature: 1,
      max_output_tokens: 65536,
      top_p: 0.95,
      thinking_level: "low",
      image_config: {
        image_size: imageSize,
      },
    },
    response_modalities: ["image", "text"],
  });

  const result: GenerateImageResult = {};

  for (const step of interaction.steps ?? []) {
    if (step.type !== "model_output" || !step.content) {
      continue;
    }

    for (const part of step.content) {
      if (part.type === "text") {
        result.text = part.text;
      } else if (part.type === "image" && part.data) {
        result.image = {
          data: part.data,
          mimeType: part.mime_type ?? "image/png",
        };
      }
    }
  }

  if (!result.text && !result.image) {
    throw new Error("Gemini API returned no image or text.");
  }

  return result;
}
