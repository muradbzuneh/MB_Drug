"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!comment.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to submit feedback.");
        return;
      }

      setComment("");
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
        <h1 className="text-2xl font-bold text-emerald-900">Feedback</h1>
        <p className="mt-1 text-sm text-emerald-700">
          Share your thoughts or suggestions about the platform.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-emerald-900 mb-1">
            Your Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Write your feedback here..."
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-700">
            ✓ Thank you for your feedback!
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
