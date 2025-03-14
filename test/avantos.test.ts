import { vi, expect, describe, it } from "vitest";
import { FetchError, getGraph } from "../src/server/avantos";
import graphJson from "../src/server/mock/graph.json";

const mockResponse = graphJson;

describe("getGraph", () => {
  it("should fetch data successfully from API", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }),
    ) as any;

    const data = await getGraph();
    expect(data).toEqual(mockResponse);

    // Check that fetch was called exactly once
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:4000/api/v1/1/actions/blueprints/bp_0/bpv_0/graph?Accept=application/json,application/problem+json",
      {
        method: "GET",
        redirect: "follow",
      },
    );
    expect(data).toEqual(mockResponse);
  });

  it("should handle fetch failure", async () => {
    global.fetch = vi.fn(() => Promise.reject("API is down"));

    const data = await getGraph();
    expect(data).toEqual({
      message: "Starting the server can lead to magical things...",
    } as FetchError);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
