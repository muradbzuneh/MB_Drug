"use client";

import { useState, type FormEvent } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    alert("User created!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-4">
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button type="submit">Signup</button>
    </form>
  );
}