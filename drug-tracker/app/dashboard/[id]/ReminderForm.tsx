"use client";

import { useState } from "react";

export default function ReminderForm({ drugId }: { drugId: string }) {
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!dosage || !time) {
      setError("Please enter dosage and time.");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        drugId,
        dosage,
        time,
      }),
    });

    if (!res.ok) {
      setError("Failed to save reminder.");
      setIsSubmitting(false);
      return;
    }

    setSuccess("Reminder saved.");
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-xl border border-emerald-100 bg-white/90 p-4 shadow">
      <h2 className="text-lg font-semibold text-emerald-900">
        Set Reminder
      </h2>

      <div className="mt-3 space-y-3">
        <input
          className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Dosage (e.g. 1 pill)"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />

        <input
          type="time"
          className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full rounded-xl bg-emerald-600 p-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save Reminder"}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      </div>
    </div>
  );
}