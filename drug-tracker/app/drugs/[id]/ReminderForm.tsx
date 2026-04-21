"use client";

import { useState } from "react";

export default function ReminderForm({ drugId }: { drugId: string }) {
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/usage", {
      method: "POST",
      body: JSON.stringify({
        drugId,
        dosage,
        time,
      }),
    });

    alert("Reminder set!");
  };

  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow">
      <h2 className="text-lg font-semibold text-emerald-900">
        Set Reminder
      </h2>

      <div className="mt-3 space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Dosage (e.g. 1 pill)"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />

        <input
          type="time"
          className="w-full rounded border p-2"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full rounded bg-emerald-600 p-2 text-white hover:bg-emerald-700"
        >
          Save Reminder
        </button>
      </div>
    </div>
  );
}