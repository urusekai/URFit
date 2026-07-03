export type WeatherSummary = {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError = {
  ok: false;
  error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type GenerateOutfitRequest = {
  prompt: string;
  weatherContext?: string;
};

export type GenerateOutfitResponse = {
  text: string;
};

export type GenerateImageResponse = {
  text?: string;
  image?: {
    data: string;
    mimeType: string;
  };
};
