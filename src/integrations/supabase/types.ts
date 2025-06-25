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
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          type: string
          user_id: string | null
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: string
          user_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      model_appointments: {
        Row: {
          attachment_url: string | null
          created_at: string
          date: string
          end_time: string
          id: string
          is_recurring: boolean
          model_id: string
          notes: string | null
          recurrence_end: string | null
          recurrence_type: string | null
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_recurring?: boolean
          model_id: string
          notes?: string | null
          recurrence_end?: string | null
          recurrence_type?: string | null
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_recurring?: boolean
          model_id?: string
          notes?: string | null
          recurrence_end?: string | null
          recurrence_type?: string | null
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_appointments_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_sessions: {
        Row: {
          client_contact: string | null
          client_name: string | null
          created_at: string
          date: string
          description: string | null
          end_time: string | null
          id: string
          location: string
          meeting_link: string | null
          model_id: string | null
          notes: string | null
          payment: number | null
          rating: number | null
          session_type: string | null
          start_time: string
          status: string
          title: string
          user_id: string | null
        }
        Insert: {
          client_contact?: string | null
          client_name?: string | null
          created_at?: string
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          location: string
          meeting_link?: string | null
          model_id?: string | null
          notes?: string | null
          payment?: number | null
          rating?: number | null
          session_type?: string | null
          start_time: string
          status?: string
          title: string
          user_id?: string | null
        }
        Update: {
          client_contact?: string | null
          client_name?: string | null
          created_at?: string
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string
          meeting_link?: string | null
          model_id?: string | null
          notes?: string | null
          payment?: number | null
          rating?: number | null
          session_type?: string | null
          start_time?: string
          status?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_model_sessions_model_id"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_sessions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          age: number | null
          artistic_name: string | null
          bio: string | null
          birth_date: string | null
          bust: string | null
          city: string | null
          country: string | null
          cpf: string | null
          created_at: string
          email: string
          ethnicity: string | null
          eyes: string | null
          gender: string | null
          hair: string | null
          height: string | null
          hips: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          photos: Json | null
          platforms: Json | null
          portfolio_images: Json | null
          rg: string | null
          shoes: string | null
          state: string | null
          status: string
          updated_at: string
          user_id: string | null
          waist: string | null
          weight: string | null
        }
        Insert: {
          age?: number | null
          artistic_name?: string | null
          bio?: string | null
          birth_date?: string | null
          bust?: string | null
          city?: string | null
          country?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          ethnicity?: string | null
          eyes?: string | null
          gender?: string | null
          hair?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          photos?: Json | null
          platforms?: Json | null
          portfolio_images?: Json | null
          rg?: string | null
          shoes?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          waist?: string | null
          weight?: string | null
        }
        Update: {
          age?: number | null
          artistic_name?: string | null
          bio?: string | null
          birth_date?: string | null
          bust?: string | null
          city?: string | null
          country?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          ethnicity?: string | null
          eyes?: string | null
          gender?: string | null
          hair?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          photos?: Json | null
          platforms?: Json | null
          portfolio_images?: Json | null
          rg?: string | null
          shoes?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          waist?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      note_categories: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      note_favorites: {
        Row: {
          created_at: string
          id: string
          note_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_favorites_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_tag_relations: {
        Row: {
          created_at: string
          id: string
          note_id: string
          tag_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          tag_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          tag_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_tag_relations_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "note_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      note_tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          attachment_url: string | null
          attachments: Json | null
          category: string
          content: string
          created_at: string
          id: string
          model_id: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          attachments?: Json | null
          category: string
          content: string
          created_at?: string
          id?: string
          model_id?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          attachments?: Json | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          model_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          auto_save: boolean | null
          backup_frequency: string
          created_at: string
          id: string
          language: string
          notifications: boolean | null
          theme: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auto_save?: boolean | null
          backup_frequency?: string
          created_at?: string
          id?: string
          language?: string
          notifications?: boolean | null
          theme?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auto_save?: boolean | null
          backup_frequency?: string
          created_at?: string
          id?: string
          language?: string
          notifications?: boolean | null
          theme?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: string
          checklist: Json | null
          completed_at: string | null
          created_at: string
          deadline: string | null
          description: string | null
          elapsed_time: number | null
          id: string
          platform: string | null
          priority: string
          status: string
          time_estimate: number | null
          time_type: string
          timer_start_time: number | null
          timer_status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assignee?: string
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          elapsed_time?: number | null
          id?: string
          platform?: string | null
          priority?: string
          status?: string
          time_estimate?: number | null
          time_type?: string
          timer_start_time?: number | null
          timer_status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assignee?: string
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          elapsed_time?: number | null
          id?: string
          platform?: string | null
          priority?: string
          status?: string
          time_estimate?: number | null
          time_type?: string
          timer_start_time?: number | null
          timer_status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          aprovado_por: string | null
          created_at: string
          data_aprovacao: string | null
          data_cadastro: string
          email: string
          id: string
          nome: string | null
          role: string | null
          status_conta: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_cadastro?: string
          email: string
          id?: string
          nome?: string | null
          role?: string | null
          status_conta?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_cadastro?: string
          email?: string
          id?: string
          nome?: string | null
          role?: string | null
          status_conta?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_audit_log: {
        Args: {
          p_action: string
          p_entity_type: string
          p_entity_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_approved: {
        Args: { user_uuid: string }
        Returns: boolean
      }
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
