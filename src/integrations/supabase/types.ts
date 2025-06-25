export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      game_participants: {
        Row: {
          game_id: string | null
          id: string
          name: string
          participant_index: number
          updated_at: string | null
        }
        Insert: {
          game_id?: string | null
          id?: string
          name?: string
          participant_index: number
          updated_at?: string | null
        }
        Update: {
          game_id?: string | null
          id?: string
          name?: string
          participant_index?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          created_at: string | null
          id: string
          ladder_connections: Json
          participant_count: number
          results: Json
        }
        Insert: {
          created_at?: string | null
          id: string
          ladder_connections: Json
          participant_count: number
          results: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          ladder_connections?: Json
          participant_count?: number
          results?: Json
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          text: string
          type: string
          url_data: Json | null
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          text: string
          type: string
          url_data?: Json | null
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          text?: string
          type?: string
          url_data?: Json | null
          user_name?: string
        }
        Relationships: []
      }
      내주변산책로: {
        Row: {
          ADIT_DC: string | null
          CorusDetailName: string | null
          CoursCode: string
          CoursDetailLength: number | null
          CoursLength: string | null
          CoursLv: string | null
          CoursName: string | null
          CoursRoute: string | null
          CoursTime: string | null
          Option: string | null
          SIGNGU_NM: string | null
          Toilet: string | null
        }
        Insert: {
          ADIT_DC?: string | null
          CorusDetailName?: string | null
          CoursCode: string
          CoursDetailLength?: number | null
          CoursLength?: string | null
          CoursLv?: string | null
          CoursName?: string | null
          CoursRoute?: string | null
          CoursTime?: string | null
          Option?: string | null
          SIGNGU_NM?: string | null
          Toilet?: string | null
        }
        Update: {
          ADIT_DC?: string | null
          CorusDetailName?: string | null
          CoursCode?: string
          CoursDetailLength?: number | null
          CoursLength?: string | null
          CoursLv?: string | null
          CoursName?: string | null
          CoursRoute?: string | null
          CoursTime?: string | null
          Option?: string | null
          SIGNGU_NM?: string | null
          Toilet?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
