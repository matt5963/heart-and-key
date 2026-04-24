import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn('Missing Supabase environment variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(url || 'https://example.supabase.co', anonKey || 'missing-key')

window.storage = {
  async get(key) {
    const { data, error } = await supabase
      .from('kv_store')
      .select('value')
      .eq('key', key)
      .maybeSingle()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error('Supabase get error:', error)
      return null
    }
    if (!data) return null
    return { key, value: data.value }
  },

  async set(key, value) {
    const { error } = await supabase
      .from('kv_store')
      .upsert({ key, value, updated_at: new Date().toISOString() })

    if (error) {
      console.error('Supabase set error:', error)
      throw error
    }
    return { key, value }
  },

  async delete(key) {
    const { error } = await supabase.from('kv_store').delete().eq('key', key)
    if (error) throw error
    return { key, deleted: true }
  },

  async list(prefix) {
    const { data, error } = await supabase
      .from('kv_store')
      .select('key')
      .like('key', `${prefix}%`)
    if (error) throw error
    return { keys: (data || []).map(r => r.key) }
  },
}
