import { Fingerprint, Logs, type LucideProps } from "lucide-react";
import {
  type ForwardRefExoticComponent,
  type RefAttributes,
  useContext,
} from "react";
import { Button } from "../../../components/ui/button";
import { ConfigContext } from "../../../context/config-context";
import { NavigationMenuItem } from "./navigation-item";

type NavigationProps = {
  activeItem: number;
  setActiveItem: (id: number) => void;
};

export type NavigationItem = {
  id: number;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
};

const navigationItems: NavigationItem[] = [
  { id: 1, icon: Fingerprint, label: "Credentials" },
  { id: 2, icon: Logs, label: "Logs" },
];

export const Navigation = ({ activeItem, setActiveItem }: NavigationProps) => {
  const { toggleConfigDialog } = useContext(ConfigContext);

  return (
    <div className="col-span-1 flex select-none flex-col justify-between gap-3 rounded-md border border-zinc-700/30 bg-zinc-900/80 p-2">
      <div className="flex flex-1 flex-col gap-0.5">
        {navigationItems.map((item) => (
          <NavigationMenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.id}
            handleClick={() => setActiveItem(item.id)}
          />
        ))}
      </div>

      <Button
        variant={"indigo"}
        onClick={toggleConfigDialog}
        shortcut={"Esc"}
        small
      >
        Close
      </Button>
    </div>
  );
};
