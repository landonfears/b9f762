"use client";

import type { ActionBlueprintGraphDescription } from "~/server/avantos";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import CustomNode from "~/components/custom-node";

export default function Graph({
  graph,
}: {
  graph: ActionBlueprintGraphDescription;
}) {
  // console.log("graph", graph);

  const nodes = graph?.nodes?.map((node) => ({
    id: node.id,
    position: node.position,
    data: { label: node.data.name, type: node.type },
    type: "custom",
  }));

  const edges = graph?.edges.map((edge) => {
    const sourceNode = graph.nodes.find((node) => node.id === edge.source);
    const targetNode = graph.nodes.find((node) => node.id === edge.target);

    let sourceHandle = "bottom";
    let targetHandle = "top";

    if (sourceNode && targetNode) {
      if (targetNode.position.x > sourceNode.position.x) {
        sourceHandle = "right";
        targetHandle = "left";
      } else if (targetNode.position.x < sourceNode.position.x) {
        sourceHandle = "left";
        targetHandle = "right";
      } else if (targetNode.position.y > sourceNode.position.y) {
        sourceHandle = "bottom";
        targetHandle = "top";
      } else if (targetNode.position.y < sourceNode.position.y) {
        sourceHandle = "top";
        targetHandle = "bottom";
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
    <div style={{ height: "100%" }}>
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        nodeTypes={{ custom: CustomNode }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
