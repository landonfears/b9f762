import type { FieldTypes } from "~/lib/types";
import { cn } from "~/lib/utils";
import { Database, Eye, EyeOff, List, Sigma, Type, X } from "lucide-react";
import { Button } from "./ui/button";

export function PrefillButton({
  variant,
  label,
  type,
  onRemove,
  onToggleActive,
}: {
  variant: "ready" | "active" | "inactive" | "disabled";
  label: string;
  type: "array" | Omit<FieldTypes, "array">;
  onRemove?: () => void;
  onToggleActive?: () => void;
}) {
  // Type icon
  let TypeIcon = Type;
  switch (type) {
    case "number":
      TypeIcon = Sigma;
      break;
    case "array":
      TypeIcon = List;
      break;
    case "object":
      TypeIcon = Database;
      break;
  }
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-sm border p-3 text-xs drop-shadow-md",
        {
          "cursor-not-allowed": variant === "disabled",
          "opacity-50": variant === "disabled",
          "cursor-pointer": variant !== "disabled",
          ...(variant === "ready"
            ? {
                "border-indigo-300": true,
                "bg-indigo-100": true,
                "text-neutral-600": true,
                "hover:bg-indigo-200": true,
                "border-dashed": true,
              }
            : {
                "border-neutral-300": true,
                "bg-neutral-200": true,
                "text-neutral-800": true,
                "hover:bg-neutral-300": true,
              }),
        },
      )}
      {...(variant === "ready" ? undefined : { tabIndex: 0 })}
    >
      <TypeIcon className="h-4 w-4" />
      <p className="w-4/5 grow truncate text-left font-bold">{label}</p>

      {variant === "active" && (
        <button onClick={onToggleActive}>
          <Eye className="h-4 w-4" />
        </button>
      )}
      {variant === "inactive" && (
        <button onClick={onToggleActive}>
          <EyeOff className="h-4 w-4" />
        </button>
      )}
      {(variant === "active" || variant === "inactive") && (
        <button
          onClick={onRemove}
          className="rounded-full bg-neutral-400 p-0.5"
        >
          <X className="h-3 w-3 text-white" />
        </button>
      )}
    </div>
  );
}
