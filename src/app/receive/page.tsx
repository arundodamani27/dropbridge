"use client";

import { useState } from "react";

export default function ReceivePage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleAccess() {
    const res = await fetch("/api/access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessCode: code }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Receive File</h1>

      <input
        className="border p-2 text-black"
        placeholder="Enter access code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 ml-2"
        onClick={handleAccess}
      >
        Get File
      </button>

      {result?.downloadUrl && (
        <div className="mt-4">
          <a
            href={result.downloadUrl}
            target="_blank"
            className="text-blue-400 underline"
          >
            Download {result.fileName}
          </a>
        </div>
      )}

      {result?.error && (
        <p className="mt-4 text-red-500">{result.error}</p>
      )}
    </div>
  );
}