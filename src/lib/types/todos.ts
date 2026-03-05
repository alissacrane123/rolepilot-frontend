// ============================================
// TODO GROUP TYPES
// ============================================

export interface TodoGroup {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// TODO TYPES
// ============================================

export interface Todo {
  id: string;
  user_id: string;
  application_id?: string;
  group_id?: string;
  title: string;
  description?: string;
  completed: boolean;
  completed_at?: string;
  priority: number;
  due_date?: string;
  due_time?: string;
  reminder_at?: string;
  should_carry_over: boolean;
  is_recurring: boolean;
  recurrence_rule?: RecurrenceRule;
  notify: boolean;
  notify_minutes_before?: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  group_name?: string;
  group_color?: string;
  company_name?: string;
  role_title?: string;
}

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "custom";
  days?: string[];        // ["monday", "wednesday"]
  day_of_month?: number;
  dates?: string[];       // ["2026-03-10"]
  time?: string;          // "09:00"
}

export interface CreateTodoData {
  application_id?: string;
  group_id?: string;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  due_time?: string;
  reminder_at?: string;
  should_carry_over?: boolean;
  is_recurring?: boolean;
  recurrence_rule?: RecurrenceRule;
  notify?: boolean;
  notify_minutes_before?: number;
}

export interface TodoFilters {
  completed?: boolean;
  application_id?: string;
  group_id?: string;
  due_date?: string;
  due_before?: string;
  due_after?: string;
  search?: string;
  include_reminders?: boolean;
}