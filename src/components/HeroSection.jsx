import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useLang } from '../context/LanguageContext'
import { openWhatsApp } from '../utils/config'
import SolarSystem from './SolarSystem'

/* Les chiffres sont saisis dans Admin > Paramètres (stats_experience, stats_clients…).
   Un chiffre vide n'est pas affiché : aucune statistique inventée. */
const STAT_KEYS = ['experience', 'clients', 'repairs', 'deployments']

function parseStat(raw) {
  const n = parseInt(String(raw ?? '').replace(/[^\d]/g, ''), 10)
  if (!Number.isFinite(n) || n <= 0) return null
  return { value: n, plus: String(raw).includes('+') }
}

export default function HeroSection() {
  const { t } = useLang()
  const [stats, setStats] = useState([])

  useEffect(() => {
    let alive = true
    supabase.from('company_settings').select('key,value').in('key', STAT_KEYS.map((k) => `stats_${k}`))
      .then(({ data }) => {
        if (!alive || !data) return
        const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
        setStats(STAT_KEYS.map((k) => ({ key: k, ...parseStat(map[`stats_${k}`]) })).filter((s) => s.value))
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden bg-midnight">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-0">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">

          <div>
            <p className="mb-5 text-sm font-semibold text-ocean-light">{t('hero.eyebrow')}</p>

            <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/75">{t('hero.subtitle')}</p>

            <div className="mb-12 flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-ocean px-6 py-3.5 font-bold text-midnight transition-colors hover:bg-ocean-light"
              >
                {t('hero.ctaPrimary')}<ArrowRight size={18} className="rtl:rotate-180" />
              </button>
              <button
                onClick={() => openWhatsApp()}
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10"
              >
                {t('hero.ctaSecondary')}
              </button>
            </div>

            {stats.length > 0 && (
              <dl className="grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.key}>
                    <dd className="text-3xl font-bold leading-none text-white">{s.value}{s.plus && '+'}</dd>
                    <dt className="mt-1 text-sm text-white/65">{t(`hero.stats.${s.key}`)}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Système solaire : OmarSoft au centre, visible sur tous les appareils */}
          <div className="flex items-center justify-center">
            <SolarSystem />
          </div>

        </div>
      </div>
    </section>
  )
}
