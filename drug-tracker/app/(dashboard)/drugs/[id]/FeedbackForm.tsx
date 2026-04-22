"use client";

import { useState } from "react";

export default function FeedbackForm({ drugId }: { drugId: string }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setError("Please enter a comment.");
      return;
    }

    const numericRating = rating === "" ? undefined : Number(rating);
    if (
      numericRating !== undefined &&
      (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5)
    ) {
      setError("Rating must be an integer between 1 and 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drugId,
          comment: trimmedComment,
          rating: numericRating,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to submit feedback.");
        return;
      }

      setComment("");
      setRating("");
      setSuccess("Feedback submitted successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <h2 className="text-lg font-semibold">Leave Feedback</h2>

      <textarea
        placeholder="Write your comment..."
        className="w-full border p-2 rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <input
        type="number"
        placeholder="Rating (1-5)"
        className="w-full border p-2 rounded"
        value={rating}
        min={1}
        max={5}
        onChange={(e) => setRating(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
    </div>
  );
}