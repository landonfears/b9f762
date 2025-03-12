import { Sheet, SheetTrigger } from "~/components/ui/sheet";
import NodeButton from "./node-button";
import type { HandlePosition } from "~/server/avantos";
import { Prefill } from "./prefill";

export function CustomNode({
  data,
}: {
  data: {
    label: string;
    type: string;
    sourceHandles: HandlePosition[];
    targetHandles: HandlePosition[];
  };
}) {
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
