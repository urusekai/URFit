import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/ai/gemini";
import type { ApiResponse, GenerateOutfitResponse } from "@/types/api";

const requestSchema = z.object({
  prompt: z.string().min(1),
  weatherContext: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const prompt = body.weatherContext
      ? `${body.weatherContext}\n\n${body.prompt}`
      : body.prompt;

    const text = await generateText({
      prompt,
      systemInstruction:
        "당신은 날씨와 상황에 맞는 코디를 추천하는 패션 스타일리스트입니다. 한국어로 간결하게 답변하세요.",
    });

    const response: ApiResponse<GenerateOutfitResponse> = {
      ok: true,
      data: { text },
    };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const response: ApiResponse<GenerateOutfitResponse> = {
      ok: false,
      error: message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
