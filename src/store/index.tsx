import { createContext, useContext, useState } from "react";
import { createStore, useStore } from "zustand";
import type {
  GraphFormData,
  NodeFormField,
  NodeFormPrefill,
} from "~/lib/types";

export type RemovePrefillFunc = (nodeId: string, field: NodeFormField) => void;
export type TogglePrefillFunc = (
  nodeId: string,
  field: NodeFormField,
  active: boolean,
) => void;
export type TogglePrefillAllFunc = (nodeId: string, active: boolean) => void;
export type UpdatePrefillFunc = (
  nodeId: string,
  field: NodeFormField,
  inheritedNode: NodeFormPrefill,
) => void;

interface GraphStore {
  graph: GraphFormData;
  updated: Date;
  actions: {
    removePrefill: RemovePrefillFunc;
    togglePrefillActive: TogglePrefillFunc;
    togglePrefillAll: TogglePrefillAllFunc;
    updatePrefill: UpdatePrefillFunc;
    loadFromLocalStorage: () => void;
    updateGraphDate: () => void;
  };
}

import type { StoreApi } from "zustand";
import { LOCAL_STORAGE_KEY } from "~/constants";

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

            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(state.graph),
            );
            return { graph: state.graph };
          }),
        updatePrefill: (
          nodeId: string,
          field: NodeFormField,
          inheritedNode: NodeFormPrefill,
        ) =>
          set((state: GraphStore) => {
            const currGraphNode = state.graph.find(
              (currNode) => currNode.nodeId === nodeId,
            );
            const graphField = currGraphNode?.fields.find(
              (currField) => currField.fieldId === field.fieldId,
            );
            if (graphField) {
              graphField.prefill = inheritedNode;
            }

            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(state.graph),
            );
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

            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(state.graph),
            );
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

            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(state.graph),
            );
            return { graph: state.graph };
          }),
        loadFromLocalStorage: () =>
          set((state: GraphStore) => {
            const graph = JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_KEY) as string,
            );
            if (graph) {
              return { graph };
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
