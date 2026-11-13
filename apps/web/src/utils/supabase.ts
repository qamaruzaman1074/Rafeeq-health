import { createClient } from "@supabase/supabase-js";
import type { ConsentScope } from "@/features/couple/share-state";

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        { display_name?: string | null }
      >;
      consent_preferences: Table<
        {
          user_id: string;
          scope: ConsentScope;
          granted: boolean;
          version: number;
          updated_at: string;
        },
        {
          user_id: string;
          scope: ConsentScope;
          granted: boolean;
          version?: number;
          updated_at?: string;
        },
        { granted?: boolean }
      >;
      consent_events: Table<
        {
          id: string;
          user_id: string;
          scope: ConsentScope;
          granted: boolean;
          version: number;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          scope: ConsentScope;
          granted: boolean;
          version: number;
          created_at?: string;
        },
        never
      >;
      screening_reports: Table<
        {
          id: string;
          user_id: string;
          access_code: string;
          object_path: string;
          file_name: string;
          mime_type: string;
          file_size: number;
          created_at: string;
        },
        {
          id?: string;
          user_id?: string;
          access_code: string;
          object_path: string;
          file_name: string;
          mime_type: string;
          file_size: number;
          created_at?: string;
        },
        never
      >;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);
