import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function CustomNode({ data }: { data: { label: string; type: string } }) {
  return (
    <div className="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <div className="flex items-center justify-center"></div>
      <div>{data.type}</div>
      <div>{data.label}</div>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(CustomNode);
