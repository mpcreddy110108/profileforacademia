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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          history: Json
          id: string
          opportunity_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          history?: Json
          id?: string
          opportunity_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          history?: Json
          id?: string
          opportunity_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          created_at: string
          description: string
          file_path: string | null
          id: string
          is_demo: boolean
          occurred_on: string | null
          outcome: string | null
          score: number | null
          skills: string[]
          source: string
          title: string
          type: Database["public"]["Enums"]["evidence_type"]
          updated_at: string
          url: string | null
          user_id: string
          verification: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          description?: string
          file_path?: string | null
          id?: string
          is_demo?: boolean
          occurred_on?: string | null
          outcome?: string | null
          score?: number | null
          skills?: string[]
          source?: string
          title: string
          type: Database["public"]["Enums"]["evidence_type"]
          updated_at?: string
          url?: string | null
          user_id: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          description?: string
          file_path?: string | null
          id?: string
          is_demo?: boolean
          occurred_on?: string | null
          outcome?: string | null
          score?: number | null
          skills?: string[]
          source?: string
          title?: string
          type?: Database["public"]["Enums"]["evidence_type"]
          updated_at?: string
          url?: string | null
          user_id?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      evidence_reviews: {
        Row: {
          action: Database["public"]["Enums"]["review_action"]
          comment: string
          created_at: string
          evidence_id: string
          id: string
          reviewer_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["review_action"]
          comment?: string
          created_at?: string
          evidence_id: string
          id?: string
          reviewer_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["review_action"]
          comment?: string
          created_at?: string
          evidence_id?: string
          id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_reviews_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          completed_at: string
          id: string
          skill: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          skill: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          skill?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          created_at: string
          description: string
          id: string
          is_demo: boolean
          kind: string
          location: string
          org: string
          posted_by: string | null
          preferred: string[]
          required: Json
          stipend: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_demo?: boolean
          kind?: string
          location?: string
          org: string
          posted_by?: string | null
          preferred?: string[]
          required?: Json
          stipend?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_demo?: boolean
          kind?: string
          location?: string
          org?: string
          posted_by?: string | null
          preferred?: string[]
          required?: Json
          stipend?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          branch: string
          college: string
          consented_at: string | null
          created_at: string
          degree: string
          evidence_visible: boolean
          full_name: string
          github_url: string | null
          id: string
          is_demo: boolean
          linkedin_url: string | null
          onboarded: boolean
          photo_url: string | null
          resume_visible: boolean
          semester: string
          specialisation: string
          target_role_id: string
          updated_at: string
          visible_to_recruiters: boolean
          weekly_hours: number
        }
        Insert: {
          branch?: string
          college?: string
          consented_at?: string | null
          created_at?: string
          degree?: string
          evidence_visible?: boolean
          full_name?: string
          github_url?: string | null
          id: string
          is_demo?: boolean
          linkedin_url?: string | null
          onboarded?: boolean
          photo_url?: string | null
          resume_visible?: boolean
          semester?: string
          specialisation?: string
          target_role_id?: string
          updated_at?: string
          visible_to_recruiters?: boolean
          weekly_hours?: number
        }
        Update: {
          branch?: string
          college?: string
          consented_at?: string | null
          created_at?: string
          degree?: string
          evidence_visible?: boolean
          full_name?: string
          github_url?: string | null
          id?: string
          is_demo?: boolean
          linkedin_url?: string | null
          onboarded?: boolean
          photo_url?: string | null
          resume_visible?: boolean
          semester?: string
          specialisation?: string
          target_role_id?: string
          updated_at?: string
          visible_to_recruiters?: boolean
          weekly_hours?: number
        }
        Relationships: []
      }
      shortlists: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          recruiter_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          recruiter_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          recruiter_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlists_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "recruiter" | "institution" | "mentor"
      application_status:
        | "saved"
        | "applied"
        | "shortlisted"
        | "interview"
        | "selected"
        | "rejected"
      evidence_type:
        | "project"
        | "certification"
        | "internship"
        | "resume"
        | "assessment"
      review_action: "approved" | "rejected" | "changes-requested"
      verification_status:
        | "self-reported"
        | "peer-reviewed"
        | "institution-verified"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "recruiter", "institution", "mentor"],
      application_status: [
        "saved",
        "applied",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],
      evidence_type: [
        "project",
        "certification",
        "internship",
        "resume",
        "assessment",
      ],
      review_action: ["approved", "rejected", "changes-requested"],
      verification_status: [
        "self-reported",
        "peer-reviewed",
        "institution-verified",
      ],
    },
  },
} as const
