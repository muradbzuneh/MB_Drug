"use client";

import { useState, type FormEvent } from "react";

type DrugForm = {
  name: string;
  description: string;
  usage: string;
  bodyPart: string;
};

export default function AddDrug() {
  const [form, setForm] = useState<DrugForm>({
    name: "",
    description: "",
    usage: "",
    bodyPart: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/drugs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Drug added!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-4">
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Usage" onChange={(e) => setForm({ ...form, usage: e.target.value })} />
      <input placeholder="Body Part" onChange={(e) => setForm({ ...form, bodyPart: e.target.value })} />

      <button type="submit">Add Drug</button>
    </form>
  );
}