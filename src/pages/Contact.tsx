
import { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = new FormData(e.currentTarget)
    try {
      const res = await fetch('/functions/submit-contact', {
        method: 'POST',
        body: form
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
      e.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h2 className="text-3xl font-extrabold">Contact</h2>
      <p className="text-neutral-600 mt-2">Let’s build something. I’m open to creative tech roles and collaborations.</p>

      <form onSubmit={submit} className="card mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold">Name</label>
          <input required name="name" className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input required type="email" name="email" className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold">Message</label>
          <textarea required name="message" rows={5} className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2" />
        </div>
        <button disabled={status==='sending'} className="px-5 py-3 rounded-xl bg-neutral-900 text-white font-semibold">
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
        {status === 'sent' && <p className="text-green-600">Thanks! I’ll get back to you soon.</p>}
        {status === 'error' && <p className="text-red-600">Something went wrong. Try again.</p>}
      </form>
    </section>
  )
}
