import { FieldProperty } from "~/server/avantos";

export const LOCAL_STORAGE_KEY = "journey-builder-graph";
export const GLOBAL_MAP_DEPTH = Number.MAX_SAFE_INTEGER;

export const GLOBAL_DATA: {
  id: string;
  title: string;
  properties: Record<string, FieldProperty>;
} = {
  id: "journey-builder-global-data",
  title: "Global Data",
  properties: {
    app_id: {
      avantos_type: "short-text",
      title: "APP ID",
      type: "string",
    },
    themes: {
      avantos_type: "multi-select",
      items: {
        enum: ["dark", "light"],
        type: "string",
      },
      type: "array",
      uniqueItems: true,
    },
    site_metadata: {
      avantos_type: "object-enum",
      enum: [
        {
          url: "https://www.example.com",
          title: "Example",
          description: "An example site",
        },
      ],
      title: "Site Metadata",
      type: "object",
    },
  },
};
