"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-emerald-900">Contact</h1>
        <p className="mt-1 text-sm text-emerald-700">
          Reach out to the pharmacist or support team.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-1">Name *</label>
            <input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-1">Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-900 mb-1">Message *</label>
          <textarea
            placeholder="Write your message..."
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-700">
            ✓ Message sent successfully. We&apos;ll get back to you soon.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
}
