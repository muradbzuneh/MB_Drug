"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Drug = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export default function DrugsPage() {
  const [drugs, setDrugs] = useState<Drug[]>([]);

  useEffect(() => {
    fetch("/api/drugs")
      .then((res) => res.json())
      .then(setDrugs);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-10">
      {drugs.map((drug) => (
        <div key={drug.id} className="border p-4">
          {drug.imageUrl ? (
            <Image src={drug.imageUrl} alt={drug.name} width={320} height={200} className="h-48 w-full rounded-lg object-cover" />
          ) : null}
          <h2>{drug.name}</h2>

          <Link href={`/drugs/${drug.id}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}