"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputClass = "w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const textareaClass = "w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const primaryButtonClass = "w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to send message.");
        return;
      }

      setForm({ name: "", email: "", message: "" });
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6">
        <h1 className="text-2xl font-bold text-white">Contact</h1>
        <p className="mt-1 text-sm text-slate-400">Reach out to the pharmacist or support team.</p>
      </div>

      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
            <input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Message *</label>
          <textarea
            placeholder="Write your message..."
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={textareaClass}
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {success ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
            <CircleCheck className="h-4 w-4" />
            Message sent. We&apos;ll get back to you soon.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={primaryButtonClass}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
}
