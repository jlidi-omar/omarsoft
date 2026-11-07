/**
 * ManageMenu.jsx — Admin > Menu du site
 * • Disposition : menu vertical latéral, ou menu horizontal en haut
 * • Entrées : ordre, affichage, noms FR / AR / EN, liens personnalisés
 */
import { useEffect, useState } from 'react'
import { PanelLeft, PanelTop, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Plus, Save, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabaseClient'
import { normalizeItems, safeUrl, BUILTIN } from '../../context/MenuContext'
import { translations } from '../../i18n/translations'

const input = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean bg-white'

function LayoutCard({ active, onClick, icon: Icon, title, text, children }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={`text-start p-4 rounded-2xl border-2 transition-all bg-white ${active ? 'border-ocean ring-4 ring-ocean/10' : 'border-slate-200 hover:border-slate-300'}`}
    >
      <div className="flex items-center gap-2 mb-1 font-bold text-slate-900"><Icon size={18} className={active ? 'text-ocean' : 'text-slate-400'} />{title}</div>
      <p className="text-xs text-slate-500 mb-3">{text}</p>
      <div className="h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative">{children}</div>
    </button>
  )
}

export default function ManageMenu() {
  const [layout, setLayout] = useState('sidebar')
  const [items, setItems] = useState(() => normalizeItems([]))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const notify = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 4500) }

  useEffect(() => {
    supabase.from('company_settings').select('key,value').in('key', ['menu_layout', 'menu_items'])
      .then(({ data, error }) => {
        if (error) notify(error.message, false)
        else if (data) {
          const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
          setLayout(map.menu_layout === 'top' ? 'top' : 'sidebar')
          setItems(normalizeItems(map.menu_items))
        }
        setLoading(false)
      })
  }, [])

  const update = (i, patch) => setItems((arr) => arr.map((it, k) => (k === i ? { ...it, ...patch } : it)))
  const move = (i, d) => setItems((arr) => {
    const j = i + d
    if (j < 0 || j >= arr.length) return arr
    const next = [...arr]; [next[i], next[j]] = [next[j], next[i]]; return next
  })
  const remove = (i) => setItems((arr) => arr.filter((_, k) => k !== i))
  const add = () => setItems((arr) => [...arr, { id: `c${Date.now().toString(36)}`, custom: true, url: '', visible: true, label_fr: '', label_ar: '', label_en: '' }])
  const reset = () => { if (window.confirm('Remettre le menu par défaut (latéral, 6 entrées standard) ? Les liens personnalisés seront supprimés.')) { setLayout('sidebar'); setItems(normalizeItems([])) } }

  async function save() {
    const bad = items.find((it) => it.custom && (!(it.label_fr || it.label_ar || it.label_en) || !safeUrl(it.url)))
    if (bad) return notify('Chaque lien personnalisé a besoin d’un nom et d’une adresse valide (#section, /page, https://…, tel:+216…, mailto:…).', false)
    setSaving(true)
    const payload = items.map(({ id, visible, label_fr, label_ar, label_en, custom, url }) => ({ id, visible, label_fr, label_ar, label_en, ...(custom ? { custom: true, url: url.trim() } : {}) }))
    const { error } = await supabase.from('company_settings').upsert(
      [{ key: 'menu_layout', value: layout }, { key: 'menu_items', value: JSON.stringify(payload) }], { onConflict: 'key' })
    setSaving(false)
    if (error) notify(`Enregistrement impossible : ${error.message}`, false)
    else notify('Menu enregistré. Le site le prend en compte au prochain chargement de la page.')
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Menu du site</h1>
            <p className="text-slate-500 text-sm mt-0.5">Choisissez la disposition et organisez les entrées du menu.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"><RotateCcw size={15} />Par défaut</button>
            <button onClick={save} disabled={saving || loading} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-ocean hover:bg-ocean-dark rounded-xl disabled:opacity-60"><Save size={15} />{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </div>

        {toast && (
          <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${toast.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`} role="status">
            {toast.ok ? <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />}{toast.msg}
          </div>
        )}

        <section>
          <h2 className="font-bold text-slate-900 mb-3">Disposition</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <LayoutCard active={layout === 'sidebar'} onClick={() => setLayout('sidebar')} icon={PanelLeft} title="Menu vertical latéral" text="Colonne fixe à gauche (à droite en arabe), toujours visible sur ordinateur.">
              <div className="absolute inset-y-0 start-0 w-1/4 bg-slate-800" /><div className="absolute top-4 start-[32%] end-4 space-y-2"><div className="h-2 bg-slate-300 rounded w-2/3" /><div className="h-2 bg-slate-300 rounded" /><div className="h-2 bg-slate-300 rounded w-5/6" /></div>
            </LayoutCard>
            <LayoutCard active={layout === 'top'} onClick={() => setLayout('top')} icon={PanelTop} title="Menu horizontal en haut" text="Barre fixe en haut de page sur ordinateur. Sur mobile, le menu reste un tiroir.">
              <div className="absolute inset-x-0 top-0 h-5 bg-slate-800" /><div className="absolute top-9 start-4 end-4 space-y-2"><div className="h-2 bg-slate-300 rounded w-2/3" /><div className="h-2 bg-slate-300 rounded" /><div className="h-2 bg-slate-300 rounded w-5/6" /></div>
            </LayoutCard>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900">Entrées du menu</h2>
            <button onClick={add} className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-ocean border border-ocean/30 rounded-xl hover:bg-ocean/5"><Plus size={15} />Ajouter un lien</button>
          </div>
          <p className="text-xs text-slate-500 mb-3">Un nom laissé vide utilise le nom par défaut. L’ordre ici est l’ordre du site. Une entrée masquée disparaît du menu sans être supprimée.</p>

          {loading ? <div className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse" /> : (
            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={it.id} className={`bg-white rounded-2xl border p-4 ${it.visible ? 'border-slate-200' : 'border-slate-200 opacity-60'}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-lg w-7 text-center">{it.custom ? '🔗' : BUILTIN[it.id].emoji}</span>
                    <span className="font-bold text-slate-800 text-sm">{it.custom ? 'Lien personnalisé' : translations.fr.nav[it.id]}</span>
                    <div className="ms-auto flex items-center gap-1">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30" aria-label="Monter"><ArrowUp size={16} /></button>
                      <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30" aria-label="Descendre"><ArrowDown size={16} /></button>
                      <button onClick={() => update(i, { visible: !it.visible })} className="p-2 rounded-lg hover:bg-slate-100" aria-label={it.visible ? 'Masquer' : 'Afficher'} title={it.visible ? 'Visible : cliquer pour masquer' : 'Masqué : cliquer pour afficher'}>
                        {it.visible ? <Eye size={16} className="text-emerald-600" /> : <EyeOff size={16} className="text-slate-400" />}
                      </button>
                      {it.custom && <button onClick={() => remove(i)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" aria-label="Supprimer"><Trash2 size={16} /></button>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {['fr', 'ar', 'en'].map((l) => (
                      <input key={l} value={it[`label_${l}`]} maxLength={60} dir={l === 'ar' ? 'rtl' : 'ltr'} onChange={(e) => update(i, { [`label_${l}`]: e.target.value })}
                        placeholder={`${l.toUpperCase()} : ${it.custom ? 'nom du lien' : translations[l].nav[it.id]}`} className={input} aria-label={`Nom en ${l}`} />
                    ))}
                  </div>
                  {it.custom && (
                    <div className="mt-2">
                      <input value={it.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="#contact · /page · https://… · tel:+21654421123 · mailto:…" className={`${input} font-mono ${it.url && !safeUrl(it.url) ? 'border-red-300' : ''}`} aria-label="Adresse du lien" dir="ltr" />
                      {it.url && !safeUrl(it.url) && <p className="text-xs text-red-500 mt-1">Adresse non valide.</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}
