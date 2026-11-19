/* En-tête commun des sections : un titre, une phrase d'appui, un espacement fixe. */
export default function SectionHeader({ title, subtitle }) {
  return (
    <header className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-midnight dark:text-white lg:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300 lg:text-lg">{subtitle}</p>}
    </header>
  )
}
