
import { supabase } from '@/integrations/supabase/client';

// Optimized query functions with proper indexing support
export const optimizedQueries = {
  // Get tasks with optimized query using indexes
  getTasks: async (userId: string, status?: string) => {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    return query.order('created_at', { ascending: false }).limit(50);
  },

  // Get models with pagination and filtering
  getModels: async (userId: string, options: { 
    status?: string; 
    limit?: number; 
    offset?: number;
    search?: string;
  } = {}) => {
    let query = supabase
      .from('models')
      .select(`
        id,
        name,
        artistic_name,
        email,
        phone,
        bio,
        age,
        status,
        platforms,
        city,
        state,
        created_at,
        updated_at
      `)
      .eq('user_id', userId);

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.search) {
      query = query.or(`name.ilike.%${options.search}%,artistic_name.ilike.%${options.search}%`);
    }

    return query
      .order('created_at', { ascending: false })
      .range(options.offset || 0, (options.offset || 0) + (options.limit || 50) - 1);
  },

  // Get notes with category filtering
  getNotes: async (userId: string, options: {
    category?: string;
    limit?: number;
    search?: string;
  } = {}) => {
    let query = supabase
      .from('notes')
      .select(`
        id,
        title,
        content,
        category,
        created_at,
        updated_at
      `)
      .eq('user_id', userId);

    if (options.category) {
      query = query.eq('category', options.category);
    }

    if (options.search) {
      query = query.textSearch('title', options.search, { type: 'websearch' });
    }

    return query
      .order('created_at', { ascending: false })
      .limit(options.limit || 50);
  },

  // Get user statistics in a single optimized query
  getUserStats: async (userId: string) => {
    const [tasksResult, modelsResult, notesResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('status', { count: 'exact' })
        .eq('user_id', userId),
      
      supabase
        .from('models')
        .select('status', { count: 'exact' })
        .eq('user_id', userId),
      
      supabase
        .from('notes')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
    ]);

    return {
      tasks: tasksResult.count || 0,
      models: modelsResult.count || 0,
      notes: notesResult.count || 0,
      errors: [
        tasksResult.error,
        modelsResult.error,
        notesResult.error
      ].filter(Boolean)
    };
  }
};
