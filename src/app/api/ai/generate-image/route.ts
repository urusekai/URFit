import { NextResponse } from "next/server";
import { z } from "zod";
import { generateImage } from "@/lib/ai/gemini";
import type { ApiResponse, GenerateImageResponse } from "@/types/api";

const requestSchema = z.object({
  prompt: z.string().min(1),
  imageSize: z.enum(["512", "1K", "2K", "4K"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const result = await generateImage({
      prompt: body.prompt,
      imageSize: body.imageSize,
    });

    const response: ApiResponse<GenerateImageResponse> = {
      ok: true,
      data: result,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const response: ApiResponse<GenerateImageResponse> = {
      ok: false,
      error: message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
