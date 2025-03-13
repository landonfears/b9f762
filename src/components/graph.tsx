"use client";

import type { ActionBlueprintGraphDescription } from "~/server/avantos";
import type { FlowNodeData, HandlePosition } from "~/lib/types";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import CustomNode from "./custom-node";
import { buildGraphForm } from "~/lib/utils";
import { GraphProvider } from "~/store";
import { useState } from "react";
import { Prefill } from "./prefill";

export default function Graph({
  graph,
}: {
  graph: ActionBlueprintGraphDescription;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currNode, setCurrNode] = useState<FlowNodeData | null>(null);

  const nodes = graph?.nodes?.map((node) => ({
    id: node.id,
    position: node.position,
    data: {
      id: node.id,
      label: node.data.name,
      type: node.data.component_type,
      sourceHandles: [] as HandlePosition[],
      targetHandles: [] as HandlePosition[],
    },
    type: "custom",
  }));
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const edges = graph?.edges.map((edge) => {
    const sourceNode = graph.nodes.find((node) => node.id === edge.source);
    const targetNode = graph.nodes.find((node) => node.id === edge.target);

    let sourceHandle: HandlePosition = "bottom";
    let targetHandle: HandlePosition = "top";

    if (sourceNode && targetNode) {
      if (targetNode.position.x > sourceNode.position.x) {
        sourceHandle = "right";
        targetHandle = "left";

        nodes
          .find((n) => sourceNode.id === n.id)
          ?.data.sourceHandles.push("right");
        nodes
          .find((n) => targetNode.id === n.id)
          ?.data.targetHandles.push("left");
      } else if (targetNode.position.x < sourceNode.position.x) {
        sourceHandle = "left";
        targetHandle = "right";

        nodes
          .find((n) => sourceNode.id === n.id)
          ?.data.sourceHandles.push("left");
        nodes
          .find((n) => targetNode.id === n.id)
          ?.data.targetHandles.push("right");
      } else if (targetNode.position.y > sourceNode.position.y) {
        sourceHandle = "bottom";
        targetHandle = "top";

        nodes
          .find((n) => sourceNode.id === n.id)
          ?.data.sourceHandles.push("bottom");
        nodes
          .find((n) => targetNode.id === n.id)
          ?.data.targetHandles.push("top");
      } else if (targetNode.position.y < sourceNode.position.y) {
        sourceHandle = "top";
        targetHandle = "bottom";

        nodes
          .find((n) => sourceNode.id === n.id)
          ?.data.sourceHandles.push("top");
        nodes
          .find((n) => targetNode.id === n.id)
          ?.data.targetHandles.push("bottom");
      }
    }

    return {
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      sourceHandle,
      targetHandle,
    };
  });

  return (
    <GraphProvider initialGraph={buildGraphForm(graph)}>
      <div style={{ height: "100%" }}>
        <ReactFlow
          proOptions={{ hideAttribution: true }}
          nodes={nodes}
          edges={edges}
          nodeTypes={{ custom: CustomNode }}
          onNodeClick={(_, node) => {
            setCurrNode(nodes.find((n) => n.id === node.id)?.data ?? null);
            setIsOpen(true);
          }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {currNode && (
        <Prefill isOpen={isOpen} setIsOpen={setIsOpen} data={currNode} />
      )}
    </GraphProvider>
  );
}
