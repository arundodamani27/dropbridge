import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 border-b border-slate-800">
      <Link href="/" className="text-2xl font-bold text-white">
        DropBridge
      </Link>

      <div className="flex gap-6 text-white">
        <Link href="/upload" className="hover:text-blue-400 transition">
          Upload
        </Link>
        <Link href="/receive" className="hover:text-blue-400 transition">
          Receive
        </Link>
      </div>
    </nav>
  );
}