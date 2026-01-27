import { cva } from "class-variance-authority";
import { use } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedBell } from "../../components/ui/icons/animated-bell";
import { AnimatedCircleCheck } from "../../components/ui/icons/animated-circle-check";
import { AnimatedInfo } from "../../components/ui/icons/animated-info";
import { AnimatedTriangleAlert } from "../../components/ui/icons/animated-triangle-alert";
import { AlertContext, type AlertSchema } from "../../context/alert-context";

const alertVariants = cva(
  "flex flex-1 items-center gap-2 text-sm pl-4 -mt-px select-none z-20",
  {
    variants: {
      type: {
        success: "bg-linear-to-r from-emerald-600/20 to-emerald-900/0 to-90%",
        error: "bg-linear-to-r from-rose-600/20 to-rose-900/0 to-90%",
        warning: "bg-linear-to-r from-yellow-600/20 to-yellow-900/0 to-90%",
        info: "bg-linear-to-r from-indigo-600/20 to-indigo-900/0 to-90%",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        type: "success",
        active: true,
        class: "from-emerald-600/20 animate-gradient-success-in",
      },
      {
        type: "success",
        active: false,
        class: "from-emerald-600/0 animate-gradient-success-out",
      },
      {
        type: "error",
        active: true,
        class: "from-rose-600/20 animate-gradient-error-in",
      },
      {
        type: "error",
        active: false,
        class: "from-rose-600/0 animate-gradient-error-out",
      },
      {
        type: "warning",
        active: true,
        class: "from-yellow-600/20 animate-gradient-warning-in",
      },
      {
        type: "warning",
        active: false,
        class: "from-yellow-600/0 animate-gradient-warning-out",
      },
      {
        type: "info",
        active: true,
        class: "from-indigo-600/20 animate-gradient-info-in",
      },
      {
        type: "info",
        active: false,
        class: "from-indigo-600/0 animate-gradient-info-out",
      },
    ],
  },
);

const iconVariants = cva("opacity-0", {
  variants: {
    type: {
      success: "text-emerald-200 shadow-md",
      error: "text-rose-200",
      warning: "text-yellow-200",
      info: "text-indigo-200",
    },
    active: {
      // true: "animate-fade-in [animation-delay:150ms]",
      // false: "animate-fade-out [animation-delay:300ms]",
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

const contentVariants = cva("mix-blend-plus-lighter", {
  variants: {
    type: {
      success: "text-emerald-400",
      error: "text-rose-400",
      warning: "text-yellow-400",
      info: "text-indigo-400",
    },
    active: {
      true: "animate-fade-in [animation-delay:300ms]",
      false: "animate-fade-out [animation-delay:150ms]",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

const getIcon = (type: AlertSchema["type"]) => {
  switch (type) {
    case "success":
      return AnimatedCircleCheck;
    case "error":
      return AnimatedTriangleAlert;
    case "warning":
      return AnimatedBell;
    case "info":
      return AnimatedInfo;
  }
};

export const Alert = () => {
  const { alert, active } = use(AlertContext);
  const Icon = alert ? getIcon(alert.type) : undefined;

  return (
    <div className={twMerge(alertVariants({ type: alert?.type, active }))}>
      {Icon ? (
        <Icon
          size={18}
          className={iconVariants({ type: alert?.type, active })}
          isAnimated={active}
        />
      ) : null}
      <div className={twMerge(contentVariants({ type: alert?.type, active }))}>
        {alert?.content}
      </div>
    </div>
  );
};
