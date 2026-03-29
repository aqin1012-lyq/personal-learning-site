export function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      <h2 className="text-xl font-semibold tracking-tight text-stone-100">{title}</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-stone-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
