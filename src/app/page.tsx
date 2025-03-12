import { getGraph } from "~/server/avantos";

export default async function HomePage() {
  const graph = await getGraph();
  console.log("graph", graph);
  return <main>Journey Builder</main>;
}
