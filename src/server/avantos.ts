export interface ActionBlueprintGraphDescription {
  $schema: string;
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
  forms: Form[];
  branches: unknown[];
  triggers: unknown[];
}

export interface Node {
  id: string;
  type: string;
  position: Position;
  data: NodeData;
}

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: unknown[];
  input_mapping: Record<string, unknown>;
  sla_duration: Duration;
  approval_required: boolean;
  approval_roles: unknown[];
}

export interface Duration {
  number: number;
  unit: string;
}

export interface Edge {
  source: string;
  target: string;
}

export interface Form {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchema;
  ui_schema: UISchema;
  dynamic_field_config: DynamicFieldConfig;
}

export interface FieldSchema {
  type: string;
  properties: Record<string, FieldProperty>;
  required: string[];
}

export interface FieldProperty {
  avantos_type: string;
  title?: string;
  type: string;
  format?: string;
  enum?: string[];
  items?: FieldItems;
  uniqueItems?: boolean;
}

export interface FieldItems {
  type: string;
  enum?: string[];
}

export interface UISchema {
  type: string;
  elements: UIElement[];
}

export interface UIElement {
  type: string;
  scope: string;
  label: string;
  options?: Record<string, unknown>;
}

export type DynamicFieldConfig = Record<string, DynamicField>;

export interface DynamicField {
  selector_field: string;
  payload_fields: Record<string, PayloadField>;
  endpoint_id: string;
}

export interface PayloadField {
  type: string;
  value: string;
}

export async function getGraph() {
  const response = await fetch(
    "http://localhost:4000/api/v1/1/actions/blueprints/bp_0/bpv_0/graph?Accept=application/json,application/problem+json",
    {
      method: "GET",
      redirect: "follow",
    },
  );
  const graph = (await response.json()) as ActionBlueprintGraphDescription;
  return graph;
}
