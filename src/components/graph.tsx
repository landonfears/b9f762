"use client";

import type { ActionBlueprintGraphDescription } from "~/server/avantos";
import type { GraphFormData, HandlePosition } from "~/lib/types";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import { CustomNode } from "./custom-node";
import { buildGraphForm } from "~/lib/utils";
import { useState } from "react";

export default function Graph({
  graph,
}: {
  graph: ActionBlueprintGraphDescription;
}) {
  const [graphData, setGraphData] = useState<GraphFormData>(
    buildGraphForm(graph),
  );
  // Build graph form data
  // const graphData: GraphFormData = buildGraphForm(graph);

  const nodes = graph?.nodes?.map((node) => ({
    id: node.id,
    position: node.position,
    data: {
      label: node.data.name,
      type: node.data.component_type,
      sourceHandles: [] as HandlePosition[],
      targetHandles: [] as HandlePosition[],
      graphNodeForm: graphData.find((n) => n.nodeId === node.id),
    },
    type: "custom",
  }));

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
