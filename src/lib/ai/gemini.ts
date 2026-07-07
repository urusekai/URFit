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

/** Gemini에 넘기는 이미지 입력 (base64). */
export type ImageInput = {
  data: string;
  mimeType?: string;
};

/** 출력 종횡비. 지정하면 결과 이미지가 항상 이 비율로 나온다(입력 크기와 일치시키는 용도). */
export type ImageAspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9";

export type GenerateImageFromInputsOptions = {
  prompt: string;
  images: ImageInput[];
  temperature?: number;
  imageSize?: "512" | "1K" | "2K" | "4K";
  aspectRatio?: ImageAspectRatio;
};

export type GenerateTextFromInputsOptions = {
  prompt: string;
  images: ImageInput[];
  temperature?: number;
};

function getClient() {
  return new GoogleGenAI({
    apiKey: requireEnv(serverEnv.GEMINI_API_KEY, "GEMINI_API_KEY"),
  });
}

type InteractionInputPart =
  | { type: "text"; text: string }
  | { type: "image"; mime_type: string; data: string };

/** 텍스트 프롬프트 + 이미지들을 interactions API 입력 파트 배열로 변환 */
function buildInputParts(
  prompt: string,
  images: ImageInput[],
): InteractionInputPart[] {
  return [
    { type: "text", text: prompt },
    ...images.map<InteractionInputPart>((image) => ({
      type: "image",
      mime_type: image.mimeType ?? "image/jpeg",
      data: image.data,
    })),
  ];
}

type InteractionLike = {
  steps?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      data?: string;
      mime_type?: string;
    }>;
  }>;
};

/** interactions 응답에서 text/image 결과 추출 (generateImage 계열 공용) */
function extractInteractionResult(
  interaction: InteractionLike,
): GenerateImageResult {
  const result: GenerateImageResult = {};

  for (const step of interaction.steps ?? []) {
    if (step.type !== "model_output" || !step.content) {
      continue;
    }

    for (const part of step.content) {
      if (part.type === "text" && part.text) {
        result.text = (result.text ?? "") + part.text;
      } else if (part.type === "image" && part.data) {
        result.image = {
          data: part.data,
          mimeType: part.mime_type ?? "image/png",
        };
      }
    }
  }

  return result;
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
      // 구조화된 짧은 응답(추천 JSON 등)에는 thinking이 불필요 → 지연 대폭 감소
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 0 },
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

  const result = extractInteractionResult(interaction);

  if (!result.text && !result.image) {
    throw new Error("Gemini API returned no image or text.");
  }

  return result;
}

/**
 * 텍스트 프롬프트 + 여러 이미지를 입력받아 이미지를 생성한다. (가상 피팅용)
 * 예: 사용자 전신 사진 + 옷 이미지들 → 옷 입은 모습 합성.
 */
export async function generateImageFromInputs({
  prompt,
  images,
  temperature = 0.4,
  imageSize = "1K",
  aspectRatio,
}: GenerateImageFromInputsOptions): Promise<GenerateImageResult> {
  const ai = getClient();
  const interaction = await ai.interactions.create({
    model: serverEnv.GEMINI_IMAGE_MODEL,
    input: buildInputParts(prompt, images),
    generation_config: {
      temperature,
      max_output_tokens: 65536,
      top_p: 0.95,
      thinking_level: "low",
      image_config: {
        image_size: imageSize,
        // 종횡비를 명시하면 결과가 입력과 다른 비율(가로/세로)로 나오는 것을 막는다.
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
      },
    },
    response_modalities: ["image", "text"],
  });

  const result = extractInteractionResult(interaction);

  if (!result.image) {
    throw new Error("Gemini API returned no image.");
  }

  return result;
}

/**
 * 텍스트 프롬프트 + 여러 이미지를 입력받아 텍스트를 생성한다. (AI 코디 추천용)
 * 예: 사용자 사진 + 옷장 이미지들 → 추천 결과 JSON 문자열.
 */
export async function generateTextFromInputs({
  prompt,
  images,
  temperature = 0.5,
}: GenerateTextFromInputsOptions): Promise<string> {
  const ai = getClient();
  const interaction = await ai.interactions.create({
    model: serverEnv.GEMINI_TEXT_MODEL,
    input: buildInputParts(prompt, images),
    generation_config: {
      temperature,
      // 태깅(카테고리/스타일)은 짧은 JSON → 출력·thinking 최소화로 속도↑
      max_output_tokens: 1024,
      thinking_level: "low",
    },
    response_modalities: ["text"],
  });

  const result = extractInteractionResult(interaction);

  if (!result.text) {
    throw new Error("Gemini API returned an empty response.");
  }

  return result.text;
}
