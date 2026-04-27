"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteReminder({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/usage?id=${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="mt-3 text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition"
    >
      {loading ? "Removing..." : "Remove reminder"}
    </button>
  );
}
