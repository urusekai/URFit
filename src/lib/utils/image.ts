/**
 * 업로드 전 브라우저에서 이미지를 축소한다.
 *
 * 폰 원본 사진은 수 MB·수천 px라 그대로 올리면 (1) 업로드, (2) Gemini 태깅/피팅
 * 입력 처리, (3) 스토리지 용량이 모두 커진다. 긴 변을 maxDimension으로 줄이면
 * 태깅·피팅 속도와 업로드가 크게 빨라진다(품질 영향은 거의 없음).
 *
 * 클라이언트 전용(canvas 사용). 실패하면 원본을 그대로 반환한다.
 */
export async function downscaleImage(
  file: File,
  maxDimension = 1024,
  quality = 0.85,
): Promise<File> {
  if (typeof document === "undefined" || !file.type.startsWith("image/")) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const longEdge = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, maxDimension / longEdge);

    // 이미 충분히 작으면 그대로 사용
    if (scale >= 1) {
      bitmap.close?.();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob) {
      return file;
    }

    const name = `${file.name.replace(/\.\w+$/, "")}.jpg`;
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
