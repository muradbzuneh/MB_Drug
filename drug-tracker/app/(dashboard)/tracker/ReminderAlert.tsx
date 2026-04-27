"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing, X } from "lucide-react";

type ReminderUsage = {
  id: string;
  time: string;
  dosage: string;
  drug: { name: string };
};

export default function ReminderAlert({ usages }: { usages: ReminderUsage[] }) {
  const alertedKeysRef = useRef<Set<string>>(new Set());
  const [activeAlerts, setActiveAlerts] = useState<ReminderUsage[]>([]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM
      // Reset alerted keys at midnight so reminders fire again next day
      const today = now.toDateString();
      const dayKey = `day-${today}`;
      if (!alertedKeysRef.current.has(dayKey)) {
        alertedKeysRef.current = new Set([dayKey]);
      }

      const newAlerts: ReminderUsage[] = [];
      usages.forEach((u) => {
        const alertKey = `${u.id}-${today}-${u.time}`;
        if (u.time === currentTime && !alertedKeysRef.current.has(alertKey)) {
          alertedKeysRef.current.add(alertKey);
          newAlerts.push(u);
        }
      });

      if (newAlerts.length > 0) {
        setActiveAlerts((prev) => [...prev, ...newAlerts]);
      }
    };

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 60_000);
    return () => window.clearInterval(intervalId);
  }, [usages]);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {activeAlerts.map((u) => (
        <div
          key={`${u.id}-alert`}
          className="flex items-start gap-3 rounded-xl border border-emerald-400 bg-emerald-900 px-4 py-3 shadow-xl text-white max-w-xs"
        >
          <BellRing className="h-5 w-5 shrink-0 text-emerald-200" />
          <div className="flex-1">
            <p className="font-semibold text-emerald-200">Time to take your medicine</p>
            <p className="text-sm text-emerald-100">{u.drug.name} — {u.dosage}</p>
          </div>
          <button
            onClick={() =>
              setActiveAlerts((prev) => prev.filter((a) => a.id !== u.id))
            }
            className="ml-2 text-emerald-300 hover:text-white text-lg leading-none"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
