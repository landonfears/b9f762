import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { GraphStore, useGraphStore } from "~/store";
import graphJson from "~/server/mock/graph.json" assert { type: "json" };
import { ActionBlueprintGraphDescription } from "~/server/avantos";
import { buildGraphForm } from "~/lib/utils";
import { GRAPH_UTILS } from "~/lib/graph-utils";
import { NodeFormField, NodeFormPrefill } from "~/lib/types";

const mockResponse: ActionBlueprintGraphDescription = graphJson;
const graphStore = buildGraphForm(mockResponse);

// Mock the store module
vi.mock("~/store", () => ({
  useGraphStore: vi.fn(),
}));

describe("Graph Store", () => {
  const mockState = {
    graph: graphStore,
    updated: new Date(),
    actions: {
      removePrefill: vi.fn((nodeId: string, field: NodeFormField) => {
        mockState.graph = GRAPH_UTILS.removePrefill(
          mockState.graph,
          nodeId,
          field,
        );
      }),
      togglePrefillActive: vi.fn(
        (nodeId: string, field: NodeFormField, active: boolean) => {
          mockState.graph = GRAPH_UTILS.togglePrefillActive(
            mockState.graph,
            nodeId,
            field,
            active,
          );
        },
      ),
      togglePrefillAll: vi.fn((nodeId: string, active: boolean) => {
        mockState.graph = GRAPH_UTILS.togglePrefillAll(
          mockState.graph,
          nodeId,
          active,
        );
      }),
      updatePrefill: vi.fn(
        (
          nodeId: string,
          field: NodeFormField,
          inheritedNode: NodeFormPrefill,
        ) => {
          mockState.graph = GRAPH_UTILS.updatePrefill(
            mockState.graph,
            nodeId,
            field,
            inheritedNode,
          );
        },
      ),
      loadFromLocalStorage: vi.fn(),
      updateGraphDate: vi.fn(),
      resetStore: vi.fn(() => {
        mockState.graph = buildGraphForm(mockResponse);
      }),
    },
  };
  // Mock the implementation of useGraphStore
  (useGraphStore as Mock).mockImplementation(
    (selector: (state: GraphStore) => unknown) => selector(mockState),
  );
  const state = useGraphStore((state) => state) as GraphStore;
  beforeEach(() => {
    // Reset the mock state
    state.actions.resetStore();
  });

  it("should return the initial state", () => {
    expect(state.graph).toEqual(graphStore);
    expect(state.updated).toBeInstanceOf(Date);
  });

  it("should handle removing prefill field", () => {
    // Test the custom logic for removePrefill
    const formF = state.graph.find((node) => node.nodeTitle === "Form F");
    expect(formF).toBeDefined();
    expect(formF?.fields?.[0]?.prefill?.inheritNodeId).toBeDefined();
    state.actions.removePrefill(formF!.nodeId, formF!.fields[0]!);
    expect(formF).toBeDefined();
    expect(formF?.fields?.[0]?.prefill?.inheritNodeId).toBeUndefined();
  });

  it("should handle updating prefill field", () => {
    // Test the custom logic for removePrefill
    const formF = state.graph.find((node) => node.nodeTitle === "Form F");
    state.actions.removePrefill(formF!.nodeId, formF!.fields[0]!);
    const lastCompatibleField = formF!.fields[0]?.compatibleFields.at(-1);
    state.actions.updatePrefill(formF!.nodeId, formF!.fields[0]!, {
      active: true,
      inheritNodeId: lastCompatibleField!.nodeId,
      inheritNodeTitle: lastCompatibleField!.nodeTitle,
      inheritFieldId: lastCompatibleField!.fieldId,
    });

    expect(formF).toBeDefined();
    expect(formF?.fields?.[0]?.prefill?.inheritNodeId).toBeDefined();
    expect(formF?.fields?.[0]?.prefill?.inheritNodeId).toBe(
      lastCompatibleField!.nodeId,
    );
  });

  it("should handle toggling prefill field", () => {
    const formF = state.graph.find((node) => node.nodeTitle === "Form F");
    expect(formF).toBeDefined();
    expect(formF?.fields?.[0]?.prefill?.active).toEqual(true);
    state.actions.togglePrefillActive(formF!.nodeId, formF!.fields[0]!, false);
    expect(formF?.fields?.[0]?.prefill?.active).toEqual(false);
    state.actions.togglePrefillActive(formF!.nodeId, formF!.fields[0]!, true);
    expect(formF?.fields?.[0]?.prefill?.active).toEqual(true);
  });

  it("should handle toggling all prefill fields", () => {
    const formF = state.graph.find((node) => node.nodeTitle === "Form F");
    expect(formF).toBeDefined();
    formF?.fields.forEach((field) => {
      expect(field.prefill!.active).toBe(true);
    });
    state.actions.togglePrefillAll(formF!.nodeId, false);
    formF?.fields.forEach((field) => {
      expect(field.prefill!.active).toBe(false);
    });
    state.actions.togglePrefillAll(formF!.nodeId, true);
    formF?.fields.forEach((field) => {
      expect(field.prefill!.active).toBe(true);
    });
  });
});
