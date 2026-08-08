import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://osurztwmfayhwzfvtgqp.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5cSFBBZwKRPoj8i-yewp6g_TJgWo4lk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper functions for data sync (with safe error handling)
export const fetchSupabaseData = async (table) => {
  try {
    const { data, error } = await supabase.from(table).select('*')
    if (error) {
      console.warn(`Supabase fetch error for ${table}:`, error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn(`Supabase fetch exception for ${table}:`, err.message)
    return null
  }
}

export const insertSupabaseRecord = async (table, record) => {
  try {
    const { data, error } = await supabase.from(table).insert([record]).select()
    if (error) {
      console.warn(`Supabase insert error for ${table}:`, error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn(`Supabase insert exception for ${table}:`, err.message)
    return null
  }
}

export default supabase
