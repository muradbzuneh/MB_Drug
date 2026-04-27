"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";

export default function ProfileForm({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputClass = "w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const primaryButtonClass = "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60";

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    if (!name.trim()) { setError("Name cannot be empty."); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to update profile.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 space-y-4">
      <h2 className="font-semibold text-white">Update Name</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className={inputClass}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? (
        <p className="inline-flex items-center gap-2 text-sm text-emerald-400">
          <CircleCheck className="h-4 w-4" />
          Profile updated.
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={primaryButtonClass}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
