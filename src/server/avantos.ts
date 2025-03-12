type ActionBlueprintGraphDescription = {
  $schema: string;
  blueprint_id: string;
  blueprint_name: string;
  branches: Branch[] | null;
  created_at: string;
  created_by: string;
  description: string;
  id: string;
  name: string;
  tenant_id: string;
  updated_at: string;
  edges: Edge[] | null;
  forms: Form[] | null;
  nodes: Node[] | null;
  status: "draft" | "published" | "historical" | "archived";
  triggers: TriggerEndpoint[] | null;
  version_id: string;
  version_notes: string;
  version_number: string;
};

type Branch = {
  $schema: string;
  condition: Record<string, unknown>;
  created_at: string;
  created_by: string;
  description: string;
  id: string;
  name: string;
  tenant_id: string;
  updated_at: string;
};

type Edge = {
  source: string;
  target: string;
};

type Form = {
  $schema: string;
  custom_javascript?: string;
  description: string;
  dynamic_field_config: Record<string, object>;
  field_schema: object;
  id: string;
  is_reusable: boolean;
  name: string;
  ui_schema?: object;
  vendor_schema?: Record<string, unknown>;
};

type Node = {
  data: object;
  id: string;
  position: object;
  type: "form" | "branch" | "trigger" | "configuration";
};

type TriggerEndpoint = {
  $schema: string;
  created_at: string;
  id: string;
  max_retries?: number;
  name: string;
  output_mapping: Record<string, string>;
  path_template: string;
  path_template_variables: string[] | null;
  payload_template: Record<string, unknown>;
  payload_template_variables: string[] | null;
  query_parameter_template: Record<string, string>;
  query_parameter_template_variables: string[] | null;
  request_method: "POST" | "PUT" | "GET" | "DELETE";
  timeout_seconds?: number;
  trigger_service_id: string;
  updated_at: string;
};

export async function getGraph() {
  const test = await fetch(
    "http://localhost:4000/api/v1/1/actions/blueprints/bp_0/bpv_0/graph?Accept=application/json,application/problem+json",
    {
      method: "GET",
      redirect: "follow",
    },
  );
  const graph = (await test.json()) as ActionBlueprintGraphDescription;
  return graph;
}
