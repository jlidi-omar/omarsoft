/**
 * MenuContext.jsx — configuration du menu, modifiable dans Admin > Menu du site.
 * Stockée dans company_settings (clés menu_layout et menu_items), lisible par le public.
 * Si rien n'est configuré (ou si la base est injoignable) : menu latéral par défaut.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

/* Entrées intégrées : id → section visée (et onglet de Services le cas échéant) */
export const BUILTIN = {
  home:     { target: 'home',     emoji: '🏠' },
  products: { target: 'products', emoji: '💻' },
  services: { target: 'services', emoji: '🔧' },
  training: { target: 'services', tab: 'training', emoji: '📚' },
  media:    { target: 'media',    emoji: '🎬' },
  contact:  { target: 'contact',  emoji: '📞' },
}
export const BUILTIN_IDS = Object.keys(BUILTIN)

/* Seuls ces types de liens sont acceptés (jamais javascript:) */
export const safeUrl = (u) =>
  typeof u === 'string' && /^(#[\w-]+|\/[^\s]*|https?:\/\/[^\s]+|tel:[+\d\s-]+|mailto:[^\s@]+@[^\s@]+)$/i.test(u.trim())

const str = (v) => (typeof v === 'string' ? v.trim().slice(0, 60) : '')
const blank = (id) => ({ id, visible: true, label_fr: '', label_ar: '', label_en: '' })

/* Nettoie une configuration lue en base : ignore ce qui est invalide, ajoute les entrées manquantes */
export function normalizeItems(raw) {
  let arr = raw
  if (typeof raw === 'string') { try { arr = JSON.parse(raw) } catch { arr = [] } }
  if (!Array.isArray(arr)) arr = []
  const seen = new Set()
  const out = []
  for (const it of arr) {
    if (!it || typeof it.id !== 'string' || seen.has(it.id)) continue
    const base = { id: it.id, visible: it.visible !== false, label_fr: str(it.label_fr), label_ar: str(it.label_ar), label_en: str(it.label_en) }
    if (BUILTIN[it.id]) { out.push(base); seen.add(it.id) }
    else if (it.custom && safeUrl(it.url) && (base.label_fr || base.label_ar || base.label_en)) {
      out.push({ ...base, custom: true, url: it.url.trim() }); seen.add(it.id)
    }
  }
  for (const id of BUILTIN_IDS) if (!seen.has(id)) out.push(blank(id))
  return out
}

const CACHE_KEY = 'omarsoft_menu'
const DEFAULT_STATE = { layout: 'sidebar', items: normalizeItems([]) }

function readCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (c) return { layout: c.layout === 'top' ? 'top' : 'sidebar', items: normalizeItems(c.items) }
  } catch { /* cache illisible : on ignore */ }
  return DEFAULT_STATE
}

const MenuContext = createContext(DEFAULT_STATE)

export function MenuProvider({ children }) {
  // Le cache évite que le menu « saute » d'une disposition à l'autre au chargement
  const [state, setState] = useState(readCache)

  useEffect(() => {
    let alive = true
    supabase.from('company_settings').select('key,value').in('key', ['menu_layout', 'menu_items'])
      .then(({ data }) => {
        if (!alive || !data) return
        const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
        const next = { layout: map.menu_layout === 'top' ? 'top' : 'sidebar', items: normalizeItems(map.menu_items) }
        setState(next)
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(next)) } catch { /* stockage indisponible */ }
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  return <MenuContext.Provider value={state}>{children}</MenuContext.Provider>
}

export const useMenu = () => useContext(MenuContext)
