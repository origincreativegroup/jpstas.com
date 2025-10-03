
export default function Resume() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold">Resume</h2>
        <p className="text-neutral-600">Download a PDF or view highlights below.</p>
      </header>

      <div className="card">
        <h3 className="font-bold">Impact Highlights</h3>
        <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
          <li>Brought vehicle wraps and apparel in‑house (2017–2025), trained seasonal teams.</li>
          <li>Launched retail extension site; drove over $100k net in the first year.</li>
          <li>Migrated from legacy CRM to Jobber; digitized HR and field forms.</li>
          <li>Produced content across social, email (15–30% CTR depending on targeting).</li>
        </ul>
      </div>

      <a href="/John_P_Stas_Resume.pdf" className="mt-6 inline-block px-5 py-3 rounded-xl bg-neutral-900 text-white font-semibold">Download PDF</a>
    </section>
  )
}
