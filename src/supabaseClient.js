import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://osurztwmfayhwzfvtgqp.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5cSFBBZwKRPoj8i-yewp6g_TJgWo4lk'

let supabase = null

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
} catch (e) {
  console.warn('Supabase initialization fallback:', e)
}

// Helper functions for data sync (with 100% safe error handling)
export const fetchSupabaseData = async (table) => {
  try {
    if (!supabase) return null
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
    if (!supabase) return null
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

export const deleteSupabaseRecord = async (table, id) => {
  try {
    if (!supabase) return null
    const { data, error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      console.warn(`Supabase delete error for ${table}:`, error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn(`Supabase delete exception for ${table}:`, err.message)
    return null
  }
}

export const clearSupabaseTable = async (table) => {
  try {
    if (!supabase) return null
    const { data, error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) {
      console.warn(`Supabase clear error for ${table}:`, error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn(`Supabase clear exception for ${table}:`, err.message)
    return null
  }
}

export { supabase }
export default supabase
