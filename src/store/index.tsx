import { createContext, useContext, useState } from "react";
import { createStore, useStore } from "zustand";
import type { GraphFormData, NodeFormField } from "~/lib/types";

export type RemovePrefillFunc = (nodeId: string, field: NodeFormField) => void;
export type TogglePrefillFunc = (
  nodeId: string,
  field: NodeFormField,
  active: boolean,
) => void;
export type TogglePrefillAllFunc = (nodeId: string, active: boolean) => void;

interface GraphStore {
  graph: GraphFormData;
  updated: Date;
  actions: {
    removePrefill: RemovePrefillFunc;
    togglePrefillActive: TogglePrefillFunc;
    togglePrefillAll: TogglePrefillAllFunc;
    updateGraphDate: () => void;
  };
}

import type { StoreApi } from "zustand";

const GraphContext = createContext<StoreApi<GraphStore> | null>(null);

export const GraphProvider = ({
  children,
  initialGraph,
}: {
  children: React.ReactNode;
  initialGraph: GraphFormData;
}) => {
  const [store] = useState<StoreApi<GraphStore> | null>(() =>
    createStore((set) => ({
      graph: initialGraph,
      updated: new Date(),
      tv: 0,
      actions: {
        removePrefill: (nodeId: string, field: NodeFormField) =>
          set((state: GraphStore) => {
            const currGraphNode = state.graph.find(
              (currNode) => currNode.nodeId === nodeId,
            );
            const graphField = currGraphNode?.fields.find(
              (currField) => currField.fieldId === field.fieldId,
            );
            if (graphField) {
              graphField.prefill = null;
            }

            return { graph: state.graph };
          }),
        togglePrefillActive: (
          nodeId: string,
          field: NodeFormField,
          active: boolean,
        ) =>
          set((state: GraphStore) => {
            const currGraphNode = state.graph.find(
              (currNode) => currNode.nodeId === nodeId,
            );
            const graphField = currGraphNode?.fields.find(
              (currField) => currField.fieldId === field.fieldId,
            );
            if (graphField?.prefill) {
              graphField.prefill.active = active;
            }
            console.log("currGraphData toggle", state.graph);

            return { graph: state.graph };
          }),

        togglePrefillAll: (nodeId: string, active: boolean) =>
          set((state: GraphStore) => {
            const currGraphNode = state.graph.find(
              (currNode) => currNode.nodeId === nodeId,
            );

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

            return { graph: state.graph };
          }),
        updateGraphDate: () => set(() => ({ updated: new Date() })),
      },
    })),
  );

  return (
    <GraphContext.Provider value={store}>{children}</GraphContext.Provider>
  );
};

export const useGraphStore = (selector: (state: GraphStore) => unknown) => {
  const store = useContext(GraphContext);
  if (!store) {
    throw new Error("useGraph must be used within a GraphProvider");
  }

  return useStore(store, selector);
};
export const useGraph = () => useGraphStore((state) => state.graph);
export const useGraphUpdated = () => useGraphStore((state) => state.updated);
