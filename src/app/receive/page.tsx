import Navbar from "@/components/Navbar";
import ReceiveCard from "@/components/ReceiveCard";

export default function ReceivePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="px-6 py-16">
        <ReceiveCard />
      </div>
    </main>
  );
}