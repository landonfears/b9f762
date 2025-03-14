import { set } from "zod";
import { LOCAL_STORAGE_KEY } from "~/constants";
import type {
  GraphFormData,
  NodeFormField,
  NodeFormPrefill,
} from "~/lib/types";

const removePrefill = (
  graph: GraphFormData,
  nodeId: string,
  field: NodeFormField,
): GraphFormData => {
  const currGraphNode = graph.find((currNode) => currNode.nodeId === nodeId);
  const graphField = currGraphNode?.fields.find(
    (currField) => currField.fieldId === field.fieldId,
  );
  if (graphField) {
    graphField.prefill = null;
  }
  return graph;
};

const updatePrefill = (
  graph: GraphFormData,
  nodeId: string,
  field: NodeFormField,
  inheritedNode: NodeFormPrefill,
): GraphFormData => {
  const currGraphNode = graph.find((currNode) => currNode.nodeId === nodeId);
  const graphField = currGraphNode?.fields.find(
    (currField) => currField.fieldId === field.fieldId,
  );
  if (graphField) {
    graphField.prefill = inheritedNode;
  }
  return graph;
};

const togglePrefillActive = (
  graph: GraphFormData,
  nodeId: string,
  field: NodeFormField,
  active: boolean,
): GraphFormData => {
  const currGraphNode = graph.find((currNode) => currNode.nodeId === nodeId);
  const graphField = currGraphNode?.fields.find(
    (currField) => currField.fieldId === field.fieldId,
  );
  if (graphField?.prefill) {
    graphField.prefill.active = active;
  }
  return graph;
};

const togglePrefillAll = (
  graph: GraphFormData,
  nodeId: string,
  active: boolean,
): GraphFormData => {
  const currGraphNode = graph.find((currNode) => currNode.nodeId === nodeId);
  if (currGraphNode) {
    currGraphNode.fields.forEach((currField, index) => {
      currGraphNode.fields[index] = {
        ...currField,
        ...(currField.prefill
          ? {
              prefill: {
                ...currField.prefill,
                active,
              },
            }
          : undefined),
      };
    });
  }
  return graph;
};

const setLocalStorage = (graph: GraphFormData) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(graph));
};

export const GRAPH_UTILS = {
  removePrefill,
  updatePrefill,
  togglePrefillActive,
  togglePrefillAll,
  setLocalStorage,
};
