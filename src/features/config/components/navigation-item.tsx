import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { twMerge } from "tailwind-merge";

type NavigationItemProps = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  active: boolean;
  handleClick: () => void;
};

export const NavigationMenuItem = ({
  icon,
  label,
  active,
  handleClick,
}: NavigationItemProps) => {
  const Icon = icon;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={twMerge(
        "group flex cursor-pointer flex-row items-center gap-2 rounded-xs py-1 pt-1 pr-0 pl-1.5 text-sm text-zinc-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400",
        active ? "bg-indigo-500/10 text-indigo-100 hover:text-indigo-50" : "",
      )}
    >
      <Icon
        size={14}
        className={twMerge(
          "text-zinc-700 transition-colors group-hover:text-indigo-300",
          active ? "text-indigo-300 group-hover:text-indigo-100" : "",
        )}
      />
      {label}
    </button>
  );
};
