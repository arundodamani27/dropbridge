import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
      <div className="mb-4 text-blue-400">{icon}</div>
      <h3 className="font-semibold text-lg text-white">{title}</h3>
      <p className="text-slate-400 mt-2">{description}</p>
    </div>
  );
}