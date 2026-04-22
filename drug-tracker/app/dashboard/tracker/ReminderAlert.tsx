"use client";

import { useEffect, useRef } from "react";

type ReminderUsage = {
  id: string;
  time: string;
  dosage: string;
  drug: {
    name: string;
  };
};

export default function ReminderAlert({ usages }: { usages: ReminderUsage[] }) {
  const alertedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      usages.forEach((u) => {
        const alertKey = `${u.id}-${currentTime}`;
        if (u.time === currentTime && !alertedKeysRef.current.has(alertKey)) {
          alertedKeysRef.current.add(alertKey);
          alert(`Time to take ${u.drug.name} (${u.dosage})`);
        }
      });
    };

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [usages]);

  return null;
}