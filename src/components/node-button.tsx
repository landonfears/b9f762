import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { TableCellsMerge } from "lucide-react";
import type { FlowNodeData } from "~/lib/types";

const showOrHideStyle = (show: boolean) => {
  return {
    ...(show ? {} : { background: "transparent", border: 0 }),
  };
};
function NodeButton({ data }: { data: FlowNodeData }) {
  return (
    <div className="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md hover:border-indigo-600 hover:bg-neutral-50">
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={showOrHideStyle(data.sourceHandles.includes("top"))}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={showOrHideStyle(data.sourceHandles.includes("right"))}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={showOrHideStyle(data.sourceHandles.includes("bottom"))}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={showOrHideStyle(data.sourceHandles.includes("left"))}
      />
      <div className="flex items-center justify-center gap-2">
        <div className="rounded-md bg-indigo-700 p-2">
          <TableCellsMerge className="h-4 w-4 text-neutral-50" />
        </div>
        <div className="flex flex-col items-start justify-center gap-0">
          <span className="text-xs text-neutral-500">{data.type}</span>
          <span className="text-base">{data.label}</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={showOrHideStyle(data.targetHandles.includes("top"))}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={showOrHideStyle(data.targetHandles.includes("right"))}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={showOrHideStyle(data.targetHandles.includes("bottom"))}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={showOrHideStyle(data.targetHandles.includes("left"))}
      />
    </div>
  );
}

export default memo(NodeButton);
