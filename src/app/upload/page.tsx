"use client";

import { useState } from "react";

export default function UploadPage() {
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Test Upload</h1>
      <input type="file" onChange={handleUpload} />
      <pre className="mt-4">{message}</pre>
    </div>
  );
}