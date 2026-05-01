"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function FeedbackForm({ drugId }: { drugId: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputClass = "w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const primaryButtonClass = "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";

  const handleSubmit = async () => {
    setError("");

    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugId,
          comment: comment.trim(),
          rating: rating > 0 ? rating : undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to submit feedback.");
        return;
      }

      setComment("");
      setRating(0);
      // Refresh server component to show new feedback
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#1b345f]  bg-emerald-800 p-5 space-y-4">
      <h2 className="inline-flex items-center gap-2 font-semibold text-white">
        <MessageSquare className="h-4 w-4 text-emerald-200" />
        Leave a Review
      </h2>

      {/* Star rating */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-200">Rating (optional)</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(rating === star ? 0 : star)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className={`text-2xl transition hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-slate-600"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-200">Comment *</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this medication..."
          className={inputClass}
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={primaryButtonClass}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
