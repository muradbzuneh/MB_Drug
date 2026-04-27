"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";

export default function PrescriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const textareaClass = "w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const primaryButtonClass = "w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";

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
      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6">
        <h1 className="text-2xl font-bold text-white">Upload Prescription</h1>
        <p className="mt-1 text-sm text-slate-400">
          Send your prescription image to the pharmacist for review.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Prescription Image <span className="text-red-400">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-2.5 text-sm text-slate-400 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-700"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Note (optional)
          </label>
          <textarea
            placeholder="Add any notes for the pharmacist..."
            className={textareaClass}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {success ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
            <CircleCheck className="h-4 w-4" />
            Prescription submitted. The pharmacist will review it shortly.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={primaryButtonClass}
        >
          {isSubmitting ? "Submitting..." : "Submit Prescription"}
        </button>
      </div>
    </div>
  );
}
