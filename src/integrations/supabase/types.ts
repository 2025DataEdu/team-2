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
      건강정보: {
        Row: {
          ID: number
          나이: number | null
          성별: string | null
          "수축기 혈압": number | null
          "신장(cm)": number | null
          "운동 빈도(회/주)": string | null
          "음주 빈도(회/주)": string | null
          이름: string | null
          "이완기 혈압": number | null
          "주당 운동 시간(시간)": number | null
          "진단 질병": string | null
          "체중(kg)": number | null
          "총콜레스테롤(mg/dL)": number | null
          "혈당(mg/dL)": number | null
          혈액형: string | null
          "흡연 여부": string | null
        }
        Insert: {
          ID: number
          나이?: number | null
          성별?: string | null
          "수축기 혈압"?: number | null
          "신장(cm)"?: number | null
          "운동 빈도(회/주)"?: string | null
          "음주 빈도(회/주)"?: string | null
          이름?: string | null
          "이완기 혈압"?: number | null
          "주당 운동 시간(시간)"?: number | null
          "진단 질병"?: string | null
          "체중(kg)"?: number | null
          "총콜레스테롤(mg/dL)"?: number | null
          "혈당(mg/dL)"?: number | null
          혈액형?: string | null
          "흡연 여부"?: string | null
        }
        Update: {
          ID?: number
          나이?: number | null
          성별?: string | null
          "수축기 혈압"?: number | null
          "신장(cm)"?: number | null
          "운동 빈도(회/주)"?: string | null
          "음주 빈도(회/주)"?: string | null
          이름?: string | null
          "이완기 혈압"?: number | null
          "주당 운동 시간(시간)"?: number | null
          "진단 질병"?: string | null
          "체중(kg)"?: number | null
          "총콜레스테롤(mg/dL)"?: number | null
          "혈당(mg/dL)"?: number | null
          혈액형?: string | null
          "흡연 여부"?: string | null
        }
        Relationships: []
      }
      내주변산책로: {
        Row: {
          Address: string | null
          ADIT_DC: string | null
          CorusDetailName: string | null
          CoursCode: string
          CoursDetailLength: number | null
          CoursLength: string | null
          CoursLv: string | null
          CoursName: string | null
          CoursRoute: string | null
          CoursTime: string | null
          CVNTL_NM: string | null
          Latitude: number | null
          Longitude: number | null
          Option: string | null
          SIGNGU_NM: string | null
          Toilet: string | null
        }
        Insert: {
          Address?: string | null
          ADIT_DC?: string | null
          CorusDetailName?: string | null
          CoursCode: string
          CoursDetailLength?: number | null
          CoursLength?: string | null
          CoursLv?: string | null
          CoursName?: string | null
          CoursRoute?: string | null
          CoursTime?: string | null
          CVNTL_NM?: string | null
          Latitude?: number | null
          Longitude?: number | null
          Option?: string | null
          SIGNGU_NM?: string | null
          Toilet?: string | null
        }
        Update: {
          Address?: string | null
          ADIT_DC?: string | null
          CorusDetailName?: string | null
          CoursCode?: string
          CoursDetailLength?: number | null
          CoursLength?: string | null
          CoursLv?: string | null
          CoursName?: string | null
          CoursRoute?: string | null
          CoursTime?: string | null
          CVNTL_NM?: string | null
          Latitude?: number | null
          Longitude?: number | null
          Option?: string | null
          SIGNGU_NM?: string | null
          Toilet?: string | null
        }
        Relationships: []
      }
      전통시장현황: {
        Row: {
          PNU: string | null
          간이_도서관_보유여부: string | null
          경위도X좌표: number | null
          경위도Y좌표: number | null
          고객동선통로_보유여부: string | null
          고객지원센터보유여부: string | null
          고객휴게실_보유여부: string | null
          공동물류창고_보유여부: string | null
          교육장_보유여부: string | null
          도로명주소: string | null
          문화교실_보유여부: string | null
          물품보관함_보유여부: string | null
          방송센터_보유여부: string | null
          쇼핑카트_보유여부: string | null
          수유센터_보유여부: string | null
          스프링쿨러보유여부: string | null
          시군구: string | null
          시도: string | null
          시장명: string | null
          시장유형: string | null
          시장전용고객주차장_보유여부: string | null
          시장코드: string | null
          아케이드보유여부: string | null
          엘리베이터_에스컬레이터_보유여부: string | null
          외국인_안내센터_보유여부: string | null
          유아놀이방_보유여부: string | null
          자동심장충격기_보유여부: string | null
          자전거보관함_보유여부: string | null
          정제도로명주소: string | null
          정제지번주소: string | null
          종합콜센터_보유여부: string | null
          지번주소: string | null
          체육시설_보유여부: string | null
          코드: string
          화재감지기보유여부: string | null
          회의실_보유여부: string | null
        }
        Insert: {
          PNU?: string | null
          간이_도서관_보유여부?: string | null
          경위도X좌표?: number | null
          경위도Y좌표?: number | null
          고객동선통로_보유여부?: string | null
          고객지원센터보유여부?: string | null
          고객휴게실_보유여부?: string | null
          공동물류창고_보유여부?: string | null
          교육장_보유여부?: string | null
          도로명주소?: string | null
          문화교실_보유여부?: string | null
          물품보관함_보유여부?: string | null
          방송센터_보유여부?: string | null
          쇼핑카트_보유여부?: string | null
          수유센터_보유여부?: string | null
          스프링쿨러보유여부?: string | null
          시군구?: string | null
          시도?: string | null
          시장명?: string | null
          시장유형?: string | null
          시장전용고객주차장_보유여부?: string | null
          시장코드?: string | null
          아케이드보유여부?: string | null
          엘리베이터_에스컬레이터_보유여부?: string | null
          외국인_안내센터_보유여부?: string | null
          유아놀이방_보유여부?: string | null
          자동심장충격기_보유여부?: string | null
          자전거보관함_보유여부?: string | null
          정제도로명주소?: string | null
          정제지번주소?: string | null
          종합콜센터_보유여부?: string | null
          지번주소?: string | null
          체육시설_보유여부?: string | null
          코드: string
          화재감지기보유여부?: string | null
          회의실_보유여부?: string | null
        }
        Update: {
          PNU?: string | null
          간이_도서관_보유여부?: string | null
          경위도X좌표?: number | null
          경위도Y좌표?: number | null
          고객동선통로_보유여부?: string | null
          고객지원센터보유여부?: string | null
          고객휴게실_보유여부?: string | null
          공동물류창고_보유여부?: string | null
          교육장_보유여부?: string | null
          도로명주소?: string | null
          문화교실_보유여부?: string | null
          물품보관함_보유여부?: string | null
          방송센터_보유여부?: string | null
          쇼핑카트_보유여부?: string | null
          수유센터_보유여부?: string | null
          스프링쿨러보유여부?: string | null
          시군구?: string | null
          시도?: string | null
          시장명?: string | null
          시장유형?: string | null
          시장전용고객주차장_보유여부?: string | null
          시장코드?: string | null
          아케이드보유여부?: string | null
          엘리베이터_에스컬레이터_보유여부?: string | null
          외국인_안내센터_보유여부?: string | null
          유아놀이방_보유여부?: string | null
          자동심장충격기_보유여부?: string | null
          자전거보관함_보유여부?: string | null
          정제도로명주소?: string | null
          정제지번주소?: string | null
          종합콜센터_보유여부?: string | null
          지번주소?: string | null
          체육시설_보유여부?: string | null
          코드?: string
          화재감지기보유여부?: string | null
          회의실_보유여부?: string | null
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
