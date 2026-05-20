"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  Copy,
  CheckCircle,
  Link2,
  FileText,
} from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function UploadCard() {
  const [message, setMessage] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function uploadFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage("Unsupported file type");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("File exceeds 50MB limit");
      return;
    }

    setSelectedFile(file);
    setLoading(true);
    setProgress(0);
    setMessage("");
    setAccessCode("");

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);

      if (data.success) {
        setAccessCode(data.accessCode);
        setMessage("File uploaded successfully");
      } else {
        setMessage(data.error || "Upload failed");
      }

      setLoading(false);
    };

    xhr.onerror = () => {
      setMessage("Upload failed");
      setLoading(false);
    };

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        uploadFile(acceptedFiles[0]);
      }
    },
  });

  function copyCode() {
    navigator.clipboard.writeText(accessCode);
    setMessage("Access code copied");
  }

  function copyShareLink() {
    const shareLink = `${window.location.origin}/receive?code=${accessCode}`;
    navigator.clipboard.writeText(shareLink);
    setMessage("Share link copied");
  }

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl max-w-2xl mx-auto">
      <div className="text-center">
        <UploadCloud size={50} className="mx-auto mb-4 text-blue-400" />

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Upload Document
        </h1>

        <p className="text-slate-400 mb-8">
          Upload files from mobile or desktop and access instantly.
        </p>
      </div>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-slate-700 rounded-2xl p-8 sm:p-10 text-center cursor-pointer hover:border-blue-500 transition"
      >
        <input {...getInputProps()} />

        {loading ? (
          <div>
            <p className="text-lg text-white">
              Uploading... {progress}%
            </p>

            <div className="w-full bg-slate-700 rounded-full h-3 mt-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : isDragActive ? (
          <p className="text-lg text-blue-400">
            Drop your file here...
          </p>
        ) : (
          <div>
            <p className="text-lg text-white">
              Drag & drop your file here
            </p>
            <p className="text-slate-400 mt-2">
              or click to browse
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 text-center mt-3">
        Supported: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG (Max 50MB)
      </p>

      {selectedFile && !loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-300">
          <FileText size={18} />
          <span className="text-sm break-all">
            {selectedFile.name}
          </span>
        </div>
      )}

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
              <span className="text-3xl sm:text-4xl font-bold tracking-widest text-white">
                {accessCode}
              </span>

              <button
                onClick={copyCode}
                className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition"
              >
                <Copy size={18} className="text-white" />
              </button>

              <button
                onClick={copyShareLink}
                className="bg-purple-600 p-3 rounded-xl hover:bg-purple-700 transition"
              >
                <Link2 size={18} className="text-white" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Use access code, QR, or direct share link.
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