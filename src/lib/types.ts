export type HandlePosition = "top" | "bottom" | "left" | "right";

export interface NodeDependency {
  nodeId: string;
  nodeTitle: string;
  depth: number;
}
export interface CompatibleField {
  nodeId: string;
  nodeTitle: string;
  depth: number;
  fieldId: string;
}
interface NodeFormPrefill {
  inheritNodeId: string;
  inheritNodeTitle: string;
  inheritFieldId: string;
  active: boolean;
}
export type FieldTypes = "string" | "number" | "boolean" | "array" | "object";
export type NodeFormField =
  | {
      fieldId: string;
      type: Omit<FieldTypes, "array">;
      arrayItemType?: string;
      compatibleFields: CompatibleField[];
      prefill: NodeFormPrefill | null;
    }
  | {
      fieldId: string;
      type: "array";
      arrayItemType: string;
      compatibleFields: CompatibleField[];
      prefill: NodeFormPrefill | null;
    };
interface GraphNodeForm {
  nodeId: string;
  nodeTitle: string;
  dependencies: NodeDependency[];
  fields: NodeFormField[];
}
export type GraphFormData = GraphNodeForm[];

export interface FlowNodeData {
  id: string;
  label: string;
  type: string;
  sourceHandles: HandlePosition[];
  targetHandles: HandlePosition[];
}
