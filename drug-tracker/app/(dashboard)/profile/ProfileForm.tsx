"use client";

import { useState } from "react";

export default function ProfileForm({
  currentName,
}: {
  userId: string;
  currentName: string;
}) {
  const [name, setName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

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
    <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md space-y-4">
      <h2 className="font-semibold text-emerald-900">Update Name</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm font-medium text-emerald-700">✓ Profile updated.</p> : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
