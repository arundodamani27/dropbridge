import Navbar from "@/components/Navbar";
import UploadCard from "@/components/UploadCard";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="px-6 py-16">
        <UploadCard />
      </div>
    </main>
  );
}