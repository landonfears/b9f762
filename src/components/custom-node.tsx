import { Sheet, SheetTrigger } from "~/components/ui/sheet";
import NodeButton from "./node-button";
import type { GraphNodeData } from "~/lib/types";
import { Prefill } from "./prefill";

export function CustomNode({ data }: { data: GraphNodeData }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button>
          <NodeButton data={data} />
        </button>
      </SheetTrigger>
      <Prefill data={data} />
    </Sheet>
  );
}
