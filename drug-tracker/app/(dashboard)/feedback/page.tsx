"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";

export default function FeedbackPage() {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const textareaClass = "w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const primaryButtonClass = "w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";

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
      <div className="rounded-2xl border border-[#1b345f] bg-emerald-950 p-6">
        <h1 className="text-2xl font-bold text-white">Feedback</h1>
        <p className="mt-1 text-sm text-slate-400">
          Share your thoughts or suggestions about the platform.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1b345f] bg-emerald-800 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Your Feedback <span className="text-red-400">*</span>
          </label>
          <textarea
            placeholder="Write your feedback here..."
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={textareaClass}
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {success ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
            <CircleCheck className="h-4 w-4" />
            Thank you for your feedback!
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={primaryButtonClass}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
