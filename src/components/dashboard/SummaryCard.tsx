import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "#5675FF",
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-[#8190B0]">{title}</p>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F4FF]">
          <Icon size={21} color={iconColor} strokeWidth={1.8} />
        </div>
      </div>

      <p className="text-2xl font-bold tracking-tight text-[#17213B]">
        {value}
      </p>

      {description && (
        <p className="mt-3 text-xs text-[#94A3B8]">{description}</p>
      )}
    </div>
  );
}
