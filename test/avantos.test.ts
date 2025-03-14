import { vi, expect, describe, it } from "vitest";
import { getGraph } from "~/server/avantos";
import type { FetchError } from "~/server/avantos";
import graphJson from "~/server/mock/graph.json";

const mockResponse = graphJson;

describe("getGraph", () => {
  it("should fetch data successfully from API", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

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
    global.fetch = vi.fn(() => Promise.reject(new Error("API is down")));

    const data = await getGraph();
    expect(data).toEqual({
      message: "Starting the server can lead to magical things...",
    } as FetchError);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
