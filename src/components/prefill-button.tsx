import type { FieldTypes, GraphNodeData } from "~/lib/types";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { Database, Eye, EyeOff, List, Sigma, Type, X } from "lucide-react";

export function PrefillButton({
  data,
  variant,
  label,
  type,
}: {
  data: GraphNodeData;
  variant: "ready" | "active" | "inactive" | "disabled";
  label: string;
  type: "array" | Omit<FieldTypes, "array">;
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
    <div>
      <Button
        disabled={variant === "disabled"}
        className="flex w-full justify-start border border-neutral-300 bg-neutral-200 text-xs text-neutral-800 hover:bg-neutral-300"
      >
        <TypeIcon className="h-4 w-4" />
        <p className="max-w-4/5 grow truncate text-left font-bold">{label}</p>

        {variant === "active" && <Eye className="h-4 w-4" />}
        {variant === "inactive" && <EyeOff className="h-4 w-4" />}
        {(variant === "active" || variant === "inactive") && (
          <X className="h-4 w-4 rounded-full bg-neutral-400 p-0.5 text-white" />
        )}
      </Button>
    </div>
  );
}
