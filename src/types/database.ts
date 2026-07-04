// Supabase CLI로 생성: npx supabase gen types typescript --project-id <id> > src/types/database.ts
// (현재는 supabase/migrations/0001_onboarding_schema.sql 스키마에 맞춰 수기로 유지)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          gender: string | null;
          height: number | null;
          weight: number | null;
          age: number | null;
          style: string | null;
          brands: string[];
          body_photo_url: string | null;
          name: string | null;
          username: string | null;
          body_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          gender?: string | null;
          height?: number | null;
          weight?: number | null;
          age?: number | null;
          style?: string | null;
          brands?: string[];
          body_photo_url?: string | null;
          name?: string | null;
          username?: string | null;
          body_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gender?: string | null;
          height?: number | null;
          weight?: number | null;
          age?: number | null;
          style?: string | null;
          brands?: string[];
          body_photo_url?: string | null;
          name?: string | null;
          username?: string | null;
          body_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      clothes: {
        Row: {
          id: string;
          user_id: string;
          photo_url: string | null;
          category: string | null;
          material: string | null;
          fit: string | null;
          size: string | null;
          measurements: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          photo_url?: string | null;
          category?: string | null;
          material?: string | null;
          fit?: string | null;
          size?: string | null;
          measurements?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          photo_url?: string | null;
          category?: string | null;
          material?: string | null;
          fit?: string | null;
          size?: string | null;
          measurements?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_looks: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      fittings: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
