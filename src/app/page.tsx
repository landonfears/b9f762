import { getGraph } from "~/server/avantos";
import type { ActionBlueprintGraphDescription } from "~/server/avantos";
import Graph from "~/components/graph";

export default async function HomePage() {
  const graph: ActionBlueprintGraphDescription = await getGraph();
  return <Graph graph={graph} />;
}
