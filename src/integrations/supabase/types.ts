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
      agent_ratings: {
        Row: {
          admin_id: string
          agent_id: string
          created_at: string
          id: string
          rating: number
          updated_at: string
        }
        Insert: {
          admin_id: string
          agent_id: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
        }
        Update: {
          admin_id?: string
          agent_id?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      audio_metadata: {
        Row: {
          audio_url: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      business_favorites: {
        Row: {
          agent_id: string
          business_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          agent_id: string
          business_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          agent_id?: string
          business_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      business_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          token: string
          updated_at: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          token: string
          updated_at?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          token?: string
          updated_at?: string
          used_at?: string | null
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          business_name: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          industry: string | null
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id: string
          industry?: string | null
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      professional_details: {
        Row: {
          additional_skills: string[] | null
          availability: string[] | null
          computer_skill_level: string | null
          created_at: string | null
          id: string
          languages: string[] | null
          salary_expectation: number | null
          specialized_skills: string[] | null
          updated_at: string | null
          user_id: string
          years_experience: string | null
        }
        Insert: {
          additional_skills?: string[] | null
          availability?: string[] | null
          computer_skill_level?: string | null
          created_at?: string | null
          id?: string
          languages?: string[] | null
          salary_expectation?: number | null
          specialized_skills?: string[] | null
          updated_at?: string | null
          user_id: string
          years_experience?: string | null
        }
        Update: {
          additional_skills?: string[] | null
          availability?: string[] | null
          computer_skill_level?: string | null
          created_at?: string | null
          id?: string
          languages?: string[] | null
          salary_expectation?: number | null
          specialized_skills?: string[] | null
          updated_at?: string | null
          user_id?: string
          years_experience?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          additional_skills: string[] | null
          availability: string[] | null
          bio: string | null
          city: string | null
          computer_skill_level: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_verified: boolean
          languages: string[] | null
          phone: string | null
          role: string
          salary: number | null
          specialized_skills: string[] | null
          updated_at: string | null
          whatsapp: string | null
          years_experience: string | null
        }
        Insert: {
          additional_skills?: string[] | null
          availability?: string[] | null
          bio?: string | null
          city?: string | null
          computer_skill_level?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_verified?: boolean
          languages?: string[] | null
          phone?: string | null
          role?: string
          salary?: number | null
          specialized_skills?: string[] | null
          updated_at?: string | null
          whatsapp?: string | null
          years_experience?: string | null
        }
        Update: {
          additional_skills?: string[] | null
          availability?: string[] | null
          bio?: string | null
          city?: string | null
          computer_skill_level?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_verified?: boolean
          languages?: string[] | null
          phone?: string | null
          role?: string
          salary?: number | null
          specialized_skills?: string[] | null
          updated_at?: string | null
          whatsapp?: string | null
          years_experience?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_business_favorite: {
        Args: { business_user_id: string; agent_user_id: string }
        Returns: undefined
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_business_favorites: {
        Args: { business_user_id: string }
        Returns: string[]
      }
      remove_business_favorite: {
        Args: { business_user_id: string; agent_user_id: string }
        Returns: undefined
      }
      validate_invitation_token: {
        Args: { token_param: string }
        Returns: {
          id: string
          email: string
          expires_at: string
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "agent" | "business" | "admin"
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
    Enums: {
      app_role: ["agent", "business", "admin"],
    },
  },
} as const
