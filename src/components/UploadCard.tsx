"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { UploadCloud, Copy, CheckCircle } from "lucide-react";

export default function UploadCard() {
  const [message, setMessage] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");
    setAccessCode("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setAccessCode(data.accessCode);
      setMessage("File uploaded successfully");
    } else {
      setMessage(data.error || "Upload failed");
    }

    setLoading(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(accessCode);
    alert("Access code copied!");
  }

  return (
    <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-xl max-w-2xl mx-auto">
      <div className="text-center">
        <UploadCloud size={50} className="mx-auto mb-4 text-blue-400" />

        <h1 className="text-4xl font-bold text-white mb-4">
          Upload Document
        </h1>

        <p className="text-slate-400 mb-8">
          Upload files from your mobile and access them instantly on any device.
        </p>
      </div>

      <label className="block border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-500 transition">
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
        />

        {loading ? (
          <p className="text-lg text-white">Uploading...</p>
        ) : (
          <p className="text-lg text-white">Click to choose file</p>
        )}
      </label>

      {message && (
        <div className="mt-8 text-center">
          <CheckCircle className="mx-auto text-green-400 mb-3" />
          <p className="text-white">{message}</p>
        </div>
      )}

      {accessCode && (
        <>
          <div className="mt-8 bg-slate-800 rounded-2xl p-6 text-center">
            <p className="text-slate-400 mb-2">Your Access Code</p>

            <div className="flex justify-center items-center gap-3 flex-wrap">
              <span className="text-4xl font-bold tracking-widest text-white">
                {accessCode}
              </span>

              <button
                onClick={copyCode}
                className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700"
              >
                <Copy size={18} className="text-white" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Enter this code on another device to access your file.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-300 mb-4 text-lg">
              Scan QR on mobile
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block">
              <QRCodeCanvas
                value={`${window.location.origin}/receive?code=${accessCode}`}
                size={180}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}