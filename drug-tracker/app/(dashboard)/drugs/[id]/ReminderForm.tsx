"use client";

import { useState } from "react";
import { BellRing, CircleCheck } from "lucide-react";

export default function ReminderForm({ drugId }: { drugId: string }) {
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputClass = "w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const primaryButtonClass = "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!dosage.trim() || !time) {
      setError("Please enter both dosage and time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugId, dosage: dosage.trim(), time }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to save reminder.");
        return;
      }

      setDosage("");
      setTime("");
      setSuccess(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#1b345f]  bg-emerald-800 p-5 space-y-4">
      <h2 className="inline-flex items-center gap-2 font-semibold text-white">
        <BellRing className="h-4 w-4 text-emerald-400" />
        Set Reminder
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Dosage</label>
          <input
            value={dosage}
            onChange={(e) => {
              setDosage(e.target.value);
              if (success) setSuccess(false);
            }}
            placeholder="e.g. 1 tablet"
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (success) setSuccess(false);
            }}
            className={inputClass}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? (
        <p className="inline-flex items-center gap-2 text-sm text-emerald-400">
          <CircleCheck className="h-4 w-4" />
          Reminder saved. Check your tracker.
        </p>
      ) : null}

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className={primaryButtonClass}
      >
        {isSubmitting ? "Saving..." : "Save Reminder"}
      </button>
    </div>
  );
}
