import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ActionBlueprintGraphDescription, Node } from "~/server/avantos";
import type {
  CompatibleField,
  FieldTypes,
  GraphFormData,
  NodeDependency,
  NodeFormField,
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function buildNodeDependencies(
  graph: ActionBlueprintGraphDescription,
  node: Node | undefined,
  depth: number,
): NodeDependency[] {
  if (!node) {
    return [];
  }

  const targetEdges = graph?.edges?.filter((edge) => edge.target === node.id);

  let deps = [] as NodeDependency[];
  targetEdges.forEach((edge) => {
    const sourceNode = graph.nodes.find((n) => n.id === edge.source);
    deps = [
      ...deps,
      {
        nodeId: edge.source,
        nodeTitle: sourceNode?.data.name,
        depth,
      },
      ...buildNodeDependencies(graph, sourceNode, depth + 1),
    ] as NodeDependency[];
  });

  // Remove duplicates, keeping the one with the smallest depth
  const uniqueDepsMap = new Map<string, NodeDependency>();
  deps.forEach((dep) => {
    if (
      !uniqueDepsMap.has(dep.nodeId) ||
      uniqueDepsMap.get(dep.nodeId)!.depth > dep.depth
    ) {
      uniqueDepsMap.set(dep.nodeId, dep);
    }
  });

  return Array.from(uniqueDepsMap.values());
}

function getCompatibleFields(
  graph: ActionBlueprintGraphDescription,
  dependencies: NodeDependency[],
  type: FieldTypes,
  arrayItemType: FieldTypes | undefined,
): CompatibleField[] {
  const compatibleFields = [] as CompatibleField[];

  dependencies.forEach((dep) => {
    const formId = graph.nodes.find((node) => node.id === dep.nodeId)?.data
      .component_id;

    const form = graph.forms.find((f) => f.id === formId);
    if (form) {
      const fields = form.field_schema.properties;
      const fieldKeys = Object.keys(fields);
      fieldKeys.forEach((fieldKey) => {
        const depType = (form.field_schema.properties[fieldKey]?.type ??
          "string") as FieldTypes;
        const depArrayItemType =
          depType === "array"
            ? (form.field_schema.properties[fieldKey]?.items?.type ?? "string")
            : undefined;
        if (depType === type && depArrayItemType === arrayItemType) {
          compatibleFields.push({
            nodeId: dep.nodeId,
            nodeTitle: dep.nodeTitle,
            depth: dep.depth,
            fieldId: fieldKey,
          });
        }
      });
    }
  });

  return compatibleFields;
}

function getPrefill(
  compatibleFields: CompatibleField[],
  fieldId: string,
): NodeFormField["prefill"] {
  const fieldMatch = compatibleFields
    .filter((field) => field.fieldId === fieldId)
    .sort((a, b) => a.depth - b.depth);
  if (fieldMatch.length && fieldMatch[0]) {
    return {
      inheritNodeId: fieldMatch[0].nodeId,
      inheritNodeTitle: fieldMatch[0].nodeTitle,
      inheritFieldId: fieldMatch[0].fieldId,
      active: true,
    };
  }
  const anyMatch = compatibleFields.sort((a, b) => a.depth - b.depth);
  if (anyMatch.length && anyMatch[0]) {
    return {
      inheritNodeId: anyMatch[0].nodeId,
      inheritNodeTitle: anyMatch[0].nodeTitle,
      inheritFieldId: anyMatch[0].fieldId,
      active: true,
    };
  }
  return null;
}

function buildNodeFields(
  graph: ActionBlueprintGraphDescription,
  node: Node | undefined,
  dependencies: NodeDependency[],
): NodeFormField[] {
  const formId = node?.data.component_id;

  const form = graph.forms.find((f) => f.id === formId);
  if (!form) {
    return [];
  }

  const fields = form.field_schema.properties;
  const fieldKeys = Object.keys(fields);
  const nodeFields = fieldKeys.map((fieldKey) => {
    const type = (form.field_schema.properties[fieldKey]?.type ??
      "string") as FieldTypes;
    const arrayItemType =
      type === "array"
        ? ((form.field_schema.properties[fieldKey]?.items?.type ??
            "string") as FieldTypes)
        : undefined;
    const compatibleFields = getCompatibleFields(
      graph,
      dependencies,
      type,
      arrayItemType,
    );
    return {
      fieldId: fieldKey,
      type,
      ...(type === "array"
        ? {
            arrayItemType,
          }
        : undefined),
      compatibleFields,
      prefill: getPrefill(compatibleFields, fieldKey),
    };
  });
  return nodeFields;
}

export function buildGraphForm(graph: ActionBlueprintGraphDescription) {
  const graphData: GraphFormData = graph?.nodes?.map((node) => {
    const dependencies = buildNodeDependencies(graph, node, 1);
    return {
      nodeId: node.id,
      nodeTitle: node.data.name,
      dependencies,
      fields: buildNodeFields(graph, node, dependencies),
    };
  });
  return graphData;
}
