"use client";

import { useState } from "react";
import { uploadImage } from "@/utils/uploadImage";

export default function PrescriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Select image");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadImage(file);

      const res = await fetch("/api/prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          note: note.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        alert(data?.error ?? "Failed to send prescription.");
        return;
      }

      setFile(null);
      setNote("");
      alert("Prescription sent!");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold">Upload Prescription</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <textarea
        placeholder="Add note..."
        className="w-full border p-2"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}