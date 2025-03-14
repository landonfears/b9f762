import { buildGraphForm } from "../src/lib/utils";
import type { ActionBlueprintGraphDescription } from "~/server/avantos";
import { expect, describe, it } from "vitest";
import graphJson from "../src/server/mock/graph.json" assert { type: "json" };

const mockResponse: ActionBlueprintGraphDescription = graphJson;

describe("buildGraphForm", () => {
  const result = buildGraphForm(mockResponse);
  it("should return the correct number of nodes", async () => {
    expect(result.length).toEqual(6);

    expect(
      result.find((node) => node.nodeTitle === "Form A")?.dependencies.length,
    ).toEqual(0);
    expect(
      result.find((node) => node.nodeTitle === "Form B")?.dependencies.length,
    ).toEqual(1);
    expect(
      result.find((node) => node.nodeTitle === "Form C")?.dependencies.length,
    ).toEqual(1);
    expect(
      result.find((node) => node.nodeTitle === "Form D")?.dependencies.length,
    ).toEqual(2);
    expect(
      result.find((node) => node.nodeTitle === "Form E")?.dependencies.length,
    ).toEqual(2);
    expect(
      result.find((node) => node.nodeTitle === "Form F")?.dependencies.length,
    ).toEqual(5);
  });

  it("should return the correct dependencies", async () => {
    expect(
      result.find((node) => node.nodeTitle === "Form A")?.dependencies.length,
    ).toEqual(0);
    expect(
      result.find((node) => node.nodeTitle === "Form B")?.dependencies.length,
    ).toEqual(1);
    expect(
      result.find((node) => node.nodeTitle === "Form C")?.dependencies.length,
    ).toEqual(1);
    expect(
      result.find((node) => node.nodeTitle === "Form D")?.dependencies.length,
    ).toEqual(2);
    expect(
      result.find((node) => node.nodeTitle === "Form E")?.dependencies.length,
    ).toEqual(2);
    expect(
      result.find((node) => node.nodeTitle === "Form F")?.dependencies.length,
    ).toEqual(5);
  });

  it("should return the correct edge depth", async () => {
    const formF = result.find((node) => node.nodeTitle === "Form F");
    expect(
      formF?.dependencies.find((dep) => dep.nodeTitle === "Form E")?.depth,
    ).toEqual(1);
    expect(
      formF?.dependencies.find((dep) => dep.nodeTitle === "Form D")?.depth,
    ).toEqual(1);
    expect(
      formF?.dependencies.find((dep) => dep.nodeTitle === "Form C")?.depth,
    ).toEqual(2);
    expect(
      formF?.dependencies.find((dep) => dep.nodeTitle === "Form B")?.depth,
    ).toEqual(2);
    expect(
      formF?.dependencies.find((dep) => dep.nodeTitle === "Form A")?.depth,
    ).toEqual(3);
  });
});
