"use client";

import { useState } from "react";
import { uploadImage } from "@/utils/uploadImage";

export default function PrescriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!file) {
      setError("Please select a prescription image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadImage(file);

      const res = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, note: note.trim() || undefined }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to send prescription.");
        return;
      }

      setFile(null);
      setNote("");
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
        <h1 className="text-2xl font-bold text-emerald-900">Upload Prescription</h1>
        <p className="mt-1 text-sm text-emerald-700">
          Send your prescription image to the pharmacist for review.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-emerald-900 mb-1">
            Prescription Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-900 mb-1">
            Note (optional)
          </label>
          <textarea
            placeholder="Add any notes for the pharmacist..."
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm text-emerald-700 font-medium">
            ✓ Prescription submitted successfully. The pharmacist will review it shortly.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Prescription"}
        </button>
      </div>
    </div>
  );
}
