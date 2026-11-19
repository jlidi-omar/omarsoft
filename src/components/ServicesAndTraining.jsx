/**
 * ServicesAndTraining.jsx
 * • Écoute l'événement 'omarServiceTab' envoyé par l'orbite → change d'onglet
 * • tr() : essaie plusieurs clés de traduction puis un texte de secours,
 *   pour ne plus jamais afficher une clé brute comme "common.requestService".
 */
import { useEffect, useState } from 'react'
import {
  Wrench, Monitor, Wifi, BookOpen, Camera, TrendingUp,
  CheckCircle2, Clock, MessageCircle, AlertCircle, Send,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import SectionHeader from './SectionHeader'
import { useLang } from '../context/LanguageContext'
import { formatPrice } from '../utils/currencyFormatter'
import { openWhatsApp, buildAnydeskMessage, buildServiceMessage } from '../utils/config'

const ICON_MAP = { Wrench, Monitor, Wifi, BookOpen, Camera, TrendingUp }
const TABS = ['service', 'training', 'media']
const REQUEST_FALLBACK = { fr: 'Demander ce service', ar: 'اطلب هذه الخدمة', en: 'Request this service' }

function DynamicIcon({ name, size = 24, className = '' }) {
  const Icon = ICON_MAP[name] || Wrench
  return <Icon size={size} className={className} />
}

/* ── Formulaire AnyDesk ───────────────────────────── */
function AnyDeskSection({ t }) {
  const [form, setForm] = useState({ name: '', phone: '', anydeskId: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.anydeskId) return
    setSaving(true)
    try {
      await supabase.from('service_requests').insert({
        request_type: 'anydesk', client_name: form.name, client_phone: form.phone,
        anydesk_id: form.anydeskId, message: form.description,
      })
    } catch (_) { /* la demande part quand même par WhatsApp */ }
    openWhatsApp(buildAnydeskMessage(form))
    setSent(true)
    setSaving(false)
  }

  const input = 'w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-ocean'

  return (
    <div className="bg-midnight rounded-3xl p-8 lg:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-ocean/20 border border-ocean/30 flex items-center justify-center">
            <Monitor size={20} className="text-ocean" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">{t('anydesk.title')}</h3>
        </div>
        <p className="text-white/60 mb-8 leading-relaxed">{t('anydesk.subtitle')}</p>

        {sent ? (
          <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-6 py-4">
            <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 font-semibold">{t('contact.sent')}</p>
              <p className="text-white/50 text-sm mt-0.5">{t('anydesk.tools')}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={`${t('anydesk.namePlaceholder')} *`} className={input} />
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder={t('anydesk.phonePlaceholder')} className={input} />
            <input required value={form.anydeskId} onChange={(e) => set('anydeskId', e.target.value)} placeholder={`${t('anydesk.placeholder')} *`} className={`sm:col-span-2 font-mono ${input}`} />
            <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder={t('anydesk.descPlaceholder')} className={`sm:col-span-2 resize-none ${input}`} />
            <button type="submit" disabled={saving} className="sm:col-span-2 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-midnight font-bold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60">
              <Send size={17} />{saving ? t('common.loading') : t('anydesk.submit')}
            </button>
            <p className="sm:col-span-2 text-white/65 text-xs text-center">{t('anydesk.tools')}</p>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Ligne de service : nom et prix, description et points clés, action ─────── */
function ServiceRow({ service, lang, t, tr, getName, getDesc }) {
  const name = getName(service)
  const features = service[`features_${lang}`] || service.features_fr || []
  const perHour = service.price_type === 'per_hour' ? t('services.perHour') : ''
  const price = service.price_tnd
    ? `${formatPrice(service.price_tnd, lang)} ${perHour}`.trim()
    : tr(['services.onQuote'], lang === 'ar' ? 'حسب الطلب' : lang === 'en' ? 'On quote' : 'Sur devis')

  return (
    <li className="grid gap-4 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-start md:gap-8">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-midnight text-ocean">
          <DynamicIcon name={service.icon_name} size={20} />
        </span>
        <div>
          <h3 className="text-lg font-bold leading-snug text-midnight dark:text-white">{name}</h3>
          <p className="mt-1 text-sm font-semibold text-ocean-dark dark:text-ocean">
            {price}{service.duration ? ` · ${service.duration}` : ''}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{getDesc(service)}</p>
        {features.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-700 dark:text-slate-200">
            {features.slice(0, 4).map((feat, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="flex-none text-ocean-dark dark:text-ocean" />{feat}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={() => openWhatsApp(buildServiceMessage({ serviceName: name }))}
        className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-midnight px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-midnight-700 md:self-center dark:bg-white dark:text-midnight dark:hover:bg-slate-200"
      >
        <MessageCircle size={15} />
        {tr(['services.requestService', 'common.requestService'], REQUEST_FALLBACK[lang] || REQUEST_FALLBACK.fr)}
      </button>
    </li>
  )
}

/* ── Composant principal ──────────────────────────── */
export default function ServicesAndTraining() {
  const { t, lang, getName, getDesc } = useLang()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('service')
  const [highlighted, setHighlighted] = useState(null)

  /* Renvoie la première traduction trouvée, sinon le texte de secours */
  function tr(keys, fallback) {
    for (const k of keys) {
      const v = t(k)
      if (v && v !== k) return v
    }
    return fallback
  }

  /* Clic sur l'orbite → change l'onglet */
  useEffect(() => {
    let timer
    function onOrbit(e) {
      const tab = e.detail?.tab
      if (!TABS.includes(tab)) return
      setActiveTab(tab)
      setHighlighted(tab)
      clearTimeout(timer)
      timer = setTimeout(() => setHighlighted(null), 1200)
    }
    window.addEventListener('omarServiceTab', onOrbit)
    return () => { window.removeEventListener('omarServiceTab', onOrbit); clearTimeout(timer) }
  }, [])

  useEffect(() => {
    supabase.from('services').select('*').eq('is_visible', true).order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setServices(data || [])
        setLoading(false)
      })
  }, [])

  const tabServices = services.filter((s) => s.category === activeTab)

  return (
    <section id="services" className="py-16 lg:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('services.title')} subtitle={t('services.subtitle')} />

        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                activeTab === tab
                  ? 'bg-midnight text-white border-midnight shadow-lg shadow-midnight/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-midnight/40'
              } ${highlighted === tab ? 'ring-2 ring-ocean ring-offset-2' : ''}`}
            >
              {t(`services.categories.${tab}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <ul className="mx-auto max-w-5xl divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-700 dark:border-slate-700" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <li key={i} className="animate-pulse py-7">
                <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-3 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <AlertCircle size={18} /><span className="text-sm">{error}</span>
          </div>
        ) : tabServices.length === 0 ? (
          <p className="py-12 text-center text-slate-500">{t('common.noData')}</p>
        ) : (
          <ul className="mx-auto max-w-5xl divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-700 dark:border-slate-700">
            {tabServices.map((s) => (
              <ServiceRow key={s.id} service={s} lang={lang} t={t} tr={tr} getName={getName} getDesc={getDesc} />
            ))}
          </ul>
        )}

        {/* id="assistance" : cible du clic sur l'icône IT Support */}
        <div className="mt-16 scroll-mt-20" id="assistance">
          <AnyDeskSection t={t} />
        </div>
      </div>
    </section>
  )
}
