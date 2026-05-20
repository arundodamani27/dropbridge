import Link from "next/link";
import { Upload, Download, Shield, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Transfer documents instantly without login
        </h1>

        <p className="text-slate-400 text-lg mb-10">
          Upload files from mobile. Access them securely on any PC using a temporary code.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/upload"
            className="bg-blue-600 px-6 py-3 rounded-xl font-semibold text-white hover:bg-blue-700"
          >
            Upload File
          </Link>

          <Link
            href="/receive"
            className="border border-slate-700 px-6 py-3 rounded-xl text-white hover:bg-slate-900"
          >
            Receive File
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 px-8 pb-20">
        <FeatureCard
          icon={<Upload size={28} />}
          title="Quick Upload"
          description="Upload documents and images instantly from any device."
        />

        <FeatureCard
          icon={<Download size={28} />}
          title="Easy Access"
          description="Enter a secure code on another device to get your file."
        />

        <FeatureCard
          icon={<Shield size={28} />}
          title="Secure Transfer"
          description="Files are temporary and accessed through protected links."
        />

        <FeatureCard
          icon={<Clock size={28} />}
          title="Auto Expiry"
          description="Files expire automatically after a limited time."
        />
      </section>
    </main>
  );
}