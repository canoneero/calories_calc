"use client";

import React, { useState } from "react";

// Uses NEXT_PUBLIC_API_BASE_URL or defaults to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setResult(null);
  };

  const onUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch(`${API_BASE_URL}/api/v1/recognize`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      alert(err.message ?? String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold">NutriVision (Web)</h1>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onFileChange} />
          <button
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            onClick={onUpload}
            disabled={!file || isLoading}
          >
            {isLoading ? "Analyzing..." : "Recognize"}
          </button>
        </div>

        {result && (
          <div className="rounded border p-4">
            <h2 className="text-xl font-semibold mb-2">Result</h2>
            <p>Total calories: {result.total_calories}</p>
            {Array.isArray(result.items) && (
              <ul className="list-disc pl-6">
                {result.items.map((item: any, idx: number) => (
                  <li key={idx}>
                    {item.name}: {item.calories} kcal (conf {Math.round(item.confidence * 100)}%)
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
