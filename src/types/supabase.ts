export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          average_score: number | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          evaluations: Json | null
          files: Json | null
          id: string
          invalid_products: number | null
          metadata: Json | null
          name: string
          products: Json | null
          stats: Json | null
          status: string
          total_products: number | null
          type: string
          updated_at: string | null
          user_id: string
          valid_products: number | null
        }
        Insert: {
          average_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          evaluations?: Json | null
          files?: Json | null
          id?: string
          invalid_products?: number | null
          metadata?: Json | null
          name: string
          products?: Json | null
          stats?: Json | null
          status?: string
          total_products?: number | null
          type?: string
          updated_at?: string | null
          user_id: string
          valid_products?: number | null
        }
        Update: {
          average_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          evaluations?: Json | null
          files?: Json | null
          id?: string
          invalid_products?: number | null
          metadata?: Json | null
          name?: string
          products?: Json | null
          stats?: Json | null
          status?: string
          total_products?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
          valid_products?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_rules: {
        Row: {
          id: string
          user_id: string
          rule_type: 'category' | 'product' | 'phrase'
          rule_value: string
          warning_level: 'LOW' | 'MEDIUM' | 'HIGH'
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rule_type: 'category' | 'product' | 'phrase'
          rule_value: string
          warning_level: 'LOW' | 'MEDIUM' | 'HIGH'
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rule_type?: 'category' | 'product' | 'phrase'
          rule_value?: string
          warning_level?: 'LOW' | 'MEDIUM' | 'HIGH'
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          id: string
          analysis_id: string
          user_id: string
          name: string
          category: string | null
          description: string | null
          price: number | null
          quantity: number | null
          unit: string | null
          ean: string | null
          sku: string | null
          brand: string | null
          paleta_id: string | null
          foto: string | null
          code1: string | null
          code2: string | null
          pack_id: string | null
          fc_sku: string | null
          link: string | null
          currency: string | null
          price_gross: number | null
          price_net: number | null
          score: number | null
          status: string
          evaluation_data: Json | null
          source: string | null
          row_index: number | null
          raw_data: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          analysis_id: string
          user_id: string
          name: string
          category?: string | null
          description?: string | null
          price?: number | null
          quantity?: number | null
          unit?: string | null
          ean?: string | null
          sku?: string | null
          brand?: string | null
          paleta_id?: string | null
          foto?: string | null
          code1?: string | null
          code2?: string | null
          pack_id?: string | null
          fc_sku?: string | null
          link?: string | null
          currency?: string | null
          price_gross?: number | null
          price_net?: number | null
          score?: number | null
          status?: string
          evaluation_data?: Json | null
          source?: string | null
          row_index?: number | null
          raw_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          analysis_id?: string
          user_id?: string
          name?: string
          category?: string | null
          description?: string | null
          price?: number | null
          quantity?: number | null
          unit?: string | null
          ean?: string | null
          sku?: string | null
          brand?: string | null
          paleta_id?: string | null
          foto?: string | null
          code1?: string | null
          code2?: string | null
          pack_id?: string | null
          fc_sku?: string | null
          link?: string | null
          currency?: string | null
          price_gross?: number | null
          price_net?: number | null
          score?: number | null
          status?: string
          evaluation_data?: Json | null
          source?: string | null
          row_index?: number | null
          raw_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      analysis_files: {
        Row: {
          analysis_id: string
          error_message: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          processed_at: string | null
          product_count: number | null
          status: string
          storage_path: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          analysis_id: string
          error_message?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          processed_at?: string | null
          product_count?: number | null
          status?: string
          storage_path: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          analysis_id?: string
          error_message?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          processed_at?: string | null
          product_count?: number | null
          status?: string
          storage_path?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_files_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_files_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "user_recent_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "analysis_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rule_templates: {
        Row: {
          action: string
          category: string | null
          conditions: Json
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          name: string
          tags: string[] | null
          type: string
          updated_at: string | null
          usage_count: number | null
          weight: number
        }
        Insert: {
          action: string
          category?: string | null
          conditions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          tags?: string[] | null
          type: string
          updated_at?: string | null
          usage_count?: number | null
          weight?: number
        }
        Update: {
          action?: string
          category?: string | null
          conditions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          usage_count?: number | null
          weight?: number
        }
        Relationships: []
      }
      rules: {
        Row: {
          action: string
          conditions: Json
          created_at: string | null
          description: string | null
          id: string
          last_used_at: string | null
          name: string
          status: string
          type: string
          updated_at: string | null
          user_id: string
          weight: number
        }
        Insert: {
          action: string
          conditions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          last_used_at?: string | null
          name: string
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
          weight?: number
        }
        Update: {
          action?: string
          conditions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          last_used_at?: string | null
          name?: string
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          auto_delete_old_analyses: boolean | null
          auto_evaluate_products: boolean | null
          created_at: string | null
          data_retention_days: number | null
          default_analysis_type: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          preferences: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_delete_old_analyses?: boolean | null
          auto_evaluate_products?: boolean | null
          created_at?: string | null
          data_retention_days?: number | null
          default_analysis_type?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_delete_old_analyses?: boolean | null
          auto_evaluate_products?: boolean | null
          created_at?: string | null
          data_retention_days?: number | null
          default_analysis_type?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          clerk_user_id: string
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          clerk_user_id: string
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          clerk_user_id?: string
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_recent_analyses: {
        Row: {
          average_score: number | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          status: string | null
          total_products: number | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          average_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          status?: string | null
          total_products?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          average_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          status?: string | null
          total_products?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_statistics: {
        Row: {
          active_rules: number | null
          average_analysis_score: number | null
          completed_analyses: number | null
          email: string | null
          full_name: string | null
          last_login_at: string | null
          total_analyses: number | null
          total_products_analyzed: number | null
          total_rules: number | null
          user_id: string | null
          user_since: string | null
        }
        Relationships: []
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
