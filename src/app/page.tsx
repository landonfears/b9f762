import { getGraph } from "~/server/avantos";
import type {
  ActionBlueprintGraphDescription,
  FetchError,
} from "~/server/avantos";
import Graph from "~/components/graph";
import ErrorMessage from "~/components/fetch-error";

export default async function HomePage() {
  const graph: ActionBlueprintGraphDescription | FetchError = await getGraph();

  if ("message" in graph) {
    return <ErrorMessage error={graph} />;
  }

  return <Graph graph={graph} />;
}
