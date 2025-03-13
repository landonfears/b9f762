import { Sheet, SheetTrigger } from "~/components/ui/sheet";
import NodeButton from "./node-button";
import type { FlowNodeData } from "~/lib/types";
import { Prefill } from "./prefill";

export function CustomNode({ data }: { data: FlowNodeData }) {
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
