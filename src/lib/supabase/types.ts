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
      agent_runs: {
        Row: {
          agent_id: string
          created_at: string
          duration_ms: number | null
          error: string | null
          finished_at: string | null
          id: string
          input_summary: string | null
          items_processed: number
          metadata: Json
          output_summary: string | null
          started_at: string
          status: Database["public"]["Enums"]["agent_run_status"]
          triggered_by: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input_summary?: string | null
          items_processed?: number
          metadata?: Json
          output_summary?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["agent_run_status"]
          triggered_by?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input_summary?: string | null
          items_processed?: number
          metadata?: Json
          output_summary?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["agent_run_status"]
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          metadata: Json
          name: string
          slug: string
          status: Database["public"]["Enums"]["agent_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          metadata?: Json
          name: string
          slug: string
          status?: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
        }
        Relationships: []
      }
      approvals: {
        Row: {
          action_type: string
          agent_id: string
          agent_run_id: string | null
          created_at: string
          current_value: Json | null
          decided_at: string | null
          decided_by: string | null
          decision_id: string | null
          decision_note: string | null
          expires_at: string | null
          id: string
          metadata: Json
          proposed_value: Json
          rationale: string | null
          status: Database["public"]["Enums"]["approval_status"]
          target_record_id: string
          target_record_type: string
          updated_at: string
        }
        Insert: {
          action_type: string
          agent_id: string
          agent_run_id?: string | null
          created_at?: string
          current_value?: Json | null
          decided_at?: string | null
          decided_by?: string | null
          decision_id?: string | null
          decision_note?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json
          proposed_value: Json
          rationale?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          target_record_id: string
          target_record_type: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          agent_id?: string
          agent_run_id?: string | null
          created_at?: string
          current_value?: Json | null
          decided_at?: string | null
          decided_by?: string | null
          decision_id?: string | null
          decision_note?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json
          proposed_value?: Json
          rationale?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          target_record_id?: string
          target_record_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      briefs: {
        Row: {
          body_md: string
          brief_date: string
          created_at: string
          generated_at: string
          generated_by: string | null
          headline: string
          id: string
          operator_id: string
          structured_data: Json
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          body_md: string
          brief_date: string
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          headline: string
          id?: string
          operator_id: string
          structured_data?: Json
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          body_md?: string
          brief_date?: string
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          headline?: string
          id?: string
          operator_id?: string
          structured_data?: Json
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefs_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string
          external_account_id: string | null
          id: string
          last_error: string | null
          last_sync_at: string | null
          metadata: Json
          operator_id: string
          provider: string
          scopes: string[]
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_account_id?: string | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          metadata?: Json
          operator_id: string
          provider: string
          scopes?: string[]
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_account_id?: string | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          metadata?: Json
          operator_id?: string
          provider?: string
          scopes?: string[]
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: []
      }
      decisions: {
        Row: {
          agent_id: string
          agent_run_id: string
          confidence: number | null
          created_at: string
          decision_type: string
          id: string
          label: string
          metadata: Json
          reasoning: string | null
          signals: Json
          source_record_id: string
          source_record_type: string
        }
        Insert: {
          agent_id: string
          agent_run_id: string
          confidence?: number | null
          created_at?: string
          decision_type: string
          id?: string
          label: string
          metadata?: Json
          reasoning?: string | null
          signals?: Json
          source_record_id: string
          source_record_type: string
        }
        Update: {
          agent_id?: string
          agent_run_id?: string
          confidence?: number | null
          created_at?: string
          decision_type?: string
          id?: string
          label?: string
          metadata?: Json
          reasoning?: string | null
          signals?: Json
          source_record_id?: string
          source_record_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decisions_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_run_status: "running" | "succeeded" | "failed" | "cancelled"
      agent_status: "idle" | "running" | "errored"
      approval_status: "pending" | "approved" | "rejected" | "expired"
      connection_status: "connected" | "disconnected" | "error" | "expired"
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
  public: {
    Enums: {
      agent_run_status: ["running", "succeeded", "failed", "cancelled"],
      agent_status: ["idle", "running", "errored"],
      approval_status: ["pending", "approved", "rejected", "expired"],
      connection_status: ["connected", "disconnected", "error", "expired"],
    },
  },
} as const
