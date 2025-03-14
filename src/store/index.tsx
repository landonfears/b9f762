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

export interface GraphStore {
  graph: GraphFormData;
  updated: Date;
  actions: {
    removePrefill: RemovePrefillFunc;
    togglePrefillActive: TogglePrefillFunc;
    togglePrefillAll: TogglePrefillAllFunc;
    updatePrefill: UpdatePrefillFunc;
    loadFromLocalStorage: () => void;
    updateGraphDate: () => void;
    resetStore: () => void;
  };
}

import type { StoreApi } from "zustand";
import { LOCAL_STORAGE_KEY } from "~/constants";
import { GRAPH_UTILS } from "~/lib/graph-utils";

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
            const updatedGraph = GRAPH_UTILS.removePrefill(
              state.graph,
              nodeId,
              field,
            );
            GRAPH_UTILS.setLocalStorage(updatedGraph);
            return { graph: updatedGraph };
          }),
        updatePrefill: (
          nodeId: string,
          field: NodeFormField,
          inheritedNode: NodeFormPrefill,
        ) =>
          set((state: GraphStore) => {
            const updatedGraph = GRAPH_UTILS.updatePrefill(
              state.graph,
              nodeId,
              field,
              inheritedNode,
            );
            GRAPH_UTILS.setLocalStorage(updatedGraph);

            return { graph: updatedGraph };
          }),
        togglePrefillActive: (
          nodeId: string,
          field: NodeFormField,
          active: boolean,
        ) =>
          set((state: GraphStore) => {
            const updatedGraph = GRAPH_UTILS.togglePrefillActive(
              state.graph,
              nodeId,
              field,
              active,
            );
            GRAPH_UTILS.setLocalStorage(updatedGraph);

            return { graph: updatedGraph };
          }),
        togglePrefillAll: (nodeId: string, active: boolean) =>
          set((state: GraphStore) => {
            const updatedGraph = GRAPH_UTILS.togglePrefillAll(
              state.graph,
              nodeId,
              active,
            );
            GRAPH_UTILS.setLocalStorage(updatedGraph);

            return { graph: updatedGraph };
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
        resetStore: () =>
          set(() => ({
            graph: initialGraph,
            updated: new Date(),
          })),
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
